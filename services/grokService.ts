import { Flashcard, MindMapNode, QuizQuestion, StudyMaterial } from "../types";

const OPENROUTER_API_KEY = import.meta.env.VITE_GROK_API_KEY || "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// Use the requested model
const MODEL_NAME = "x-ai/grok-4.1-fast";

async function callGrokAPI(messages: any[], temperature: number = 0.7, responseFormat?: any) {
  const requestBody: any = {
    model: MODEL_NAME,
    messages,
    temperature,
    // enable reasoning to use grok's reasoning features
    reasoning: { enabled: true }
  };
  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }

  console.log('🤖 Calling Grok via OpenRouter...', { model: MODEL_NAME, messageCount: messages.length });

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://examninja.app',
        'X-Title': 'ExamNinja'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API Error:', response.status, errorText);
      if (response.status === 404 && errorText.includes('No endpoints')) {
        throw new Error(`No endpoints found for model ${MODEL_NAME}. Check OpenRouter / x.ai access and model name. Error: ${errorText}`);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Invalid/Unauthorized API key for OpenRouter. Check your VITE_GROK_API_KEY and account subscription. Error: ${errorText}`);
      }
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

  const data = await response.json();
    console.log('✅ OpenRouter API response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from OpenRouter API');
    }
    const message = data.choices[0].message;
    return {
      content: message.content,
      reasoning_details: message.reasoning_details
    };
  } catch (error: any) {
    console.error('❌ API call failed:', error.message);
    throw error;
  }
}

export const processContent = async (text: string, title: string): Promise<Omit<StudyMaterial, 'id' | 'createdAt'>> => {
  
  console.log('📝 Processing content...', { textLength: text.length, title });
  
  const systemPrompt = `Ти - експертний освітній AI. Проаналізуй текст конспекту українською мовою.
Твоя задача:
1. Зробити стислий конспект (Summary) до 500 слів.
2. Виділити ключові терміни та їх визначення для глосарію (мінімум 10 термінів).
3. Виділити список з 5-7 ключових фактів.
4. Створити ієрархічну структуру для ментальної карти (Mind Map) з 3 рівнями.
5. Створити 10 флеш-карток (питання - відповідь).

ВАЖЛИВО: Поверни відповідь ВИКЛЮЧНО у форматі JSON з такою структурою:
{
  "summary": "текст стислого конспекту",
  "glossary": [{"term": "термін", "definition": "визначення"}],
  "keyFacts": ["факт 1", "факт 2"],
  "mindMap": {
    "id": "root",
    "label": "Головна тема",
    "children": [
      {
        "id": "child1",
        "label": "Підтема 1",
        "children": [
          {"id": "subchild1", "label": "Деталь 1"}
        ]
      }
    ]
  },
  "flashcards": [{"question": "питання", "answer": "відповідь"}]
}`;

  const userPrompt = `Текст конспекту:\n\n${text.substring(0, 30000)}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

  const responseObj = await callGrokAPI(messages, 0.7);
  console.log('📦 Parsing Grok response...', { reasoning: !!responseObj.reasoning_details });
    
  const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
  const data = JSON.parse(responseText);
    
    if (!data.summary || !data.glossary || !data.keyFacts || !data.mindMap || !data.flashcards) {
      console.error('❌ Missing required fields in response:', Object.keys(data));
      throw new Error('Incomplete data from AI');
    }
    
    const processedFlashcards: Flashcard[] = data.flashcards.map((fc: any, index: number) => ({
      id: `fc-${Date.now()}-${index}`,
      question: fc.question,
      answer: fc.answer,
      status: 'new'
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

  } catch (error: any) {
    console.error("❌ Error processing content:", error);
    throw new Error(`Не вдалося обробити матеріал: ${error.message}`);
  }
};

export const generateQuiz = async (content: string, difficulty: string = 'medium'): Promise<QuizQuestion[]> => {
  const systemPrompt = `Створи тест з 7-10 питань на основі тексту. Рівень складності: ${difficulty}.
Мова: Українська.

Типи питань (використовуй різноманітні):
1. multiple_choice: Класичне питання з 4 варіантами відповіді.
2. true_false: Твердження, де варіанти відповіді ["Так", "Ні"].
3. fill_in_the_blank: Речення з пропущеним ключовим словом. Познач пропуск як "______".

Додай детальне пояснення (explanation) до правильної відповіді.

ВАЖЛИВО: Поверни масив об'єктів у JSON форматі:
[
  {
    "id": "q1",
    "type": "multiple_choice",
    "question": "Текст питання?",
    "options": ["Варіант 1", "Варіант 2", "Варіант 3", "Варіант 4"],
    "correctAnswer": "Варіант 1",
    "explanation": "Пояснення чому це правильна відповідь"
  }
]`;

  const userPrompt = `Текст для тесту:\n\n${content.substring(0, 30000)}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

  const responseObj = await callGrokAPI(messages, 0.8, { type: 'json_object' });
    
    // Grok може повернути об'єкт з масивом всередині
    let questions;
    try {
      const raw = typeof responseObj === 'string' ? responseObj : responseObj.content;
      const parsed = JSON.parse(raw);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.quiz || []);
    } catch {
      questions = [];
    }

    return questions;
  } catch (error) {
    console.error("Quiz gen error", error);
    return [];
  }
};

// Grok chat implementation
class GrokChat {
  private context: string;
  private conversationHistory: Array<{role: string, content: string, reasoning_details?: any}> = [];

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
  const responseObj = await callGrokAPI(this.conversationHistory, 0.7);
  const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
      
      this.conversationHistory.push({
        role: 'assistant',
        content: responseText,
        reasoning_details: (responseObj as any).reasoning_details
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
    const responseObj = await callGrokAPI(messages, 0.7);
    const responseText = typeof responseObj === 'string' ? responseObj : responseObj.content;
    return responseText || "Не вдалося пояснити.";
  } catch (error) {
    console.error('Explain concept error:', error);
    return "Помилка при генерації пояснення.";
  }
};
