import { Flashcard, MindMapNode, QuizQuestion, StudyMaterial } from "../types";

const GROQ_PROXY_URL = "/api/openrouter";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Token limits for Groq API (qwen model has ~6000 TPM limit on free tier)
// Actual token ratio is closer to 3-3.5 chars per token for Ukrainian text
const MAX_INPUT_CHARS = 12000;
const MAX_CONTENT_CHARS = 8000; // For processContent - more conservative
const MAX_QUIZ_CONTENT_CHARS = 3000; // For quiz generation - very conservative to avoid rate limit

if (!GROQ_PROXY_URL) {
  console.error('❌ Groq proxy URL not configured');
}

// Note: The actual model is configured on the server via GROQ_MODEL env var
const MODEL_NAME = "qwen/qwen3-32b (or configured server model)";

// Function to truncate text smartly (at sentence boundaries)
function truncateText(text: string | undefined, maxChars: number): string {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  
  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxChars);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?'),
    truncated.lastIndexOf('\n')
  );
  
  if (lastSentenceEnd > maxChars * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1) + '\n\n[Текст скорочено через обмеження API]';
  }
  
  return truncated + '...\n\n[Текст скорочено через обмеження API]';
}

// Helper function for retry logic with exponential backoff and rate limit handling
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error as Error;
      
      // Handle rate limit (429) with exponential backoff
      if (error?.status === 429 || error?.message?.includes('rate_limit')) {
        const retryAfter = error?.retryAfter || (delay * Math.pow(2, i) / 1000);
        const waitTime = Math.max(retryAfter * 1000, delay * Math.pow(2, i));
        console.warn(`⏳ Rate limit 429! Waiting ${(waitTime / 1000).toFixed(1)}s before retry ${i + 1}/${retries}...`);
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      } else {
        // For other errors, normal backoff
        console.warn(`⚠️ Attempt ${i + 1}/${retries} failed:`, error?.message || error);
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
  }
  
  throw lastError;
}

// Parse JSON safely from AI response (handles markdown code blocks and XML thinking tags)
function parseJsonSafely<T>(text: string): T {
  let cleaned = text.trim();
  
  // Remove <think>...</think> tags (Groq's reasoning output)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '');
  
  cleaned = cleaned.trim();
  
  // Remove markdown code blocks if present (```json...``` or ```...```)
  const codeBlockRegex = /^```(?:json)?\s*\n([\s\S]*)\n```\s*$/;
  const match = cleaned.match(codeBlockRegex);
  
  if (match) {
    cleaned = match[1].trim();
  } else if (cleaned.startsWith('```')) {
    // Fallback for non-standard formatting
    const lines = cleaned.split('\n');
    lines.shift(); // Remove first ```json or ``` line
    
    // Remove last ``` if present
    while (lines.length > 0 && lines[lines.length - 1].trim() === '```') {
      lines.pop();
    }
    
    cleaned = lines.join('\n').trim();
  }
  
  if (!cleaned) {
    throw new Error('Empty content after removing markdown blocks');
  }
  
  return JSON.parse(cleaned);
}

async function callGroqAPI(messages: { role: string; content: string }[], temperature: number = 0.6, responseFormat?: { type: string }) {
  const requestBody: any = {
    messages,
    temperature
  };

  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }
 
  console.log('🤖 Calling Groq via proxy...', { 
    messageCount: messages.length,
    totalChars: messages.reduce((sum, m) => sum + m.content.length, 0)
  });

  // Wrap in withRetry to handle rate limits automatically
  return withRetry(async () => {
    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: any = new Error(`Groq API error (${response.status}): ${errorText.substring(0, 100)}`);
      error.status = response.status;
      
      // Parse retry-after header for rate limits
      const retryAfter = response.headers.get('retry-after');
      if (retryAfter) {
        error.retryAfter = parseInt(retryAfter, 10);
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Invalid/Unauthorized API key for Groq`);
      }
      
      throw error;
    }

    const data = await response.json();
    console.log('✅ Groq API response successful');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from Groq API');
    }
    
    return {
      content: data.choices[0].message.content
    };
  });
}

export const processContent = async (text: string, title: string): Promise<Omit<StudyMaterial, 'id' | 'createdAt'>> => {
  
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Вміст не може бути порожнім');
  }

  // Truncate text to stay within token limits
  const truncatedText = truncateText(text, MAX_CONTENT_CHARS);
  
  console.log('📝 Processing content...', { 
    originalLength: text.length, 
    truncatedLength: truncatedText.length,
    title 
  });
  
  const systemPrompt = `Ти - експертний освітній AI. Проаналізуй текст конспекту українською мовою.
Твоя задача:
1. Зробити стислий конспект (Summary) до 300 слів.
2. Виділити ключові терміни та їх визначення для глосарію (5-8 термінів).
3. Виділити список з 5 ключових фактів.
4. Створити ієрархічну структуру для ментальної карти (Mind Map) з 2-3 рівнями.
5. Створити 8 флеш-карток (питання - відповідь).

ВАЖЛИВО: Поверни відповідь ВИКЛЮЧНО у форматі JSON:
{
  "summary": "текст стислого конспекту",
  "glossary": [{"term": "термін", "definition": "визначення"}],
  "keyFacts": ["факт 1", "факт 2"],
  "mindMap": {
    "id": "root",
    "label": "Головна тема",
    "children": [{"id": "child1", "label": "Підтема", "children": []}]
  },
  "flashcards": [{"question": "питання", "answer": "відповідь"}]
}`;

  const userPrompt = `Текст конспекту:\n\n${truncatedText}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Use retry logic for reliability
    const responseObj = await withRetry(() => callGroqAPI(messages, 0.7));
    console.log('📦 Parsing Groq response...');
    
    const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
    const data = parseJsonSafely<{
      summary: string;
      glossary: { term: string; definition: string }[];
      keyFacts: string[];
      mindMap: MindMapNode;
      flashcards: { question: string; answer: string }[];
    }>(responseText);
    
    if (!data.summary || !data.glossary || !data.keyFacts || !data.mindMap || !data.flashcards) {
      console.error('❌ Missing required fields in response:', Object.keys(data));
      throw new Error('Incomplete data from AI');
    }
    
    const processedFlashcards: Flashcard[] = data.flashcards.map((fc, index: number) => ({
      id: `fc-${Date.now()}-${index}`,
      question: fc.question,
      answer: fc.answer,
      status: 'new' as const
    }));

    console.log('✅ Content processed successfully');

    return {
      title: title || "Новий матеріал",
      originalContent: text,
      summary: data.summary,
      glossary: data.glossary,
      keyFacts: data.keyFacts,
      mindMap: data.mindMap,
      flashcards: processedFlashcards
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ Error processing content:", errorMessage);
    throw new Error(`Не вдалося обробити матеріал: ${errorMessage}`);
  }
};

export const generateQuiz = async (content: string, difficulty: string = 'medium'): Promise<QuizQuestion[]> => {
  // Validate input
  if (!content || content.trim().length === 0) {
    throw new Error('Вміст для генерації тесту не може бути порожнім');
  }

  // Use MUCH smaller truncation for quiz to avoid rate limiting
  // Quiz generation happens right after content processing, so we're already using tokens
  const truncatedContent = truncateText(content, MAX_QUIZ_CONTENT_CHARS);
  
  // Determine question count based on difficulty
  const questionCount = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 15 : 12;
  
  const systemPrompt = `Ти - експертний тестувальник. Створи ${questionCount} питань на основі КОРОТКИХ ключових пунктів.
Рівень: ${difficulty === 'easy' ? 'легкий (базові концепції)' : difficulty === 'hard' ? 'важкий (глибокі знання, суперечливі теми)' : 'середній'}.
Мова: Українська.

ТИПИ: 1) multiple_choice (4 варіанти), 2) true_false (Так/Ні)

Поверни ТІЛЬКИ JSON масив:
[{"id":"q1","type":"multiple_choice","question":"?","options":["A","B","C","D"],"correctAnswer":"A","explanation":"..."}]`;

  const userPrompt = `КЛЮЧОВІ ПУНКТИ:\n${truncatedContent}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const responseObj = await callGroqAPI(messages, 0.7);
    
    let questions: QuizQuestion[] = [];
    try {
      const raw = typeof responseObj === 'string' ? responseObj : responseObj.content;
      const parsed = parseJsonSafely<any>(raw);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.quiz || []);
    } catch (parseError) {
      console.error("❌ JSON parse error in quiz generation:", (parseError as Error).message);
      console.log("Raw response was:", responseObj);
      questions = [];
    }

    return questions;
  } catch (error) {
    console.error("❌ Quiz generation error:", error);
    return [];
  }
};

// Grok chat implementation
class GrokChat {
  private context: string;
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor(context: string) {
    this.context = context;
    this.conversationHistory.push({
      role: 'system',
      content: `Ти - доброзичливий репетитор ExamNinja. Твоя мета - допомогти користувачеві зрозуміти матеріал.
Використовуй контекст нижче, щоб відповідати на запитання.
Пояснюй просто, наводь аналогії з реального життя.
Якщо питання не стосується контексту, ввічливо спробуй повернути розмову до теми, але відповідай.
Мова: Українська.

КОНТЕКСТ МАТЕРІАЛУ:
${context.substring(0, 30000)}`
    });
  }

  async sendMessage(params: { message: string }): Promise<{ text: string }> {
    this.conversationHistory.push({
      role: 'user',
      content: params.message
    });

    try {
  const responseObj = await callGroqAPI(this.conversationHistory, 0.7);
  const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
      
      this.conversationHistory.push({
        role: 'assistant',
        content: responseText
      });

      // Keep conversation history manageable (last 10 messages)
      if (this.conversationHistory.length > 11) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system message
          ...this.conversationHistory.slice(-10)
        ];
      }

      return { text: responseText };
    } catch (error) {
      console.error('Grok chat error:', error);
      return { text: 'Вибачте, виникла помилка при обробці вашого повідомлення.' };
    }
  }
}

export const createStudyChat = (context: string): GrokChat => {
  return new GrokChat(context);
};

export const explainConcept = async (concept: string, context: string): Promise<string> => {
  const messages = [
    {
      role: 'system',
      content: 'Ти - доброзичливий вчитель. Пояснюй терміни просто та зрозуміло, використовуй аналогії з реального життя. Мова: Українська.'
    },
    {
      role: 'user',
      content: `Поясни термін або фразу "${concept}" максимально просто, "як для друга".
      
Контекст: ${context.substring(0, 5000)}`
    }
  ];

  try {
    const responseObj = await callGroqAPI(messages, 0.7);
    const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
    return responseText || "Не вдалося пояснити.";
  } catch (error) {
    console.error('Explain concept error:', error);
    return "Помилка при генерації пояснення.";
  }
};
