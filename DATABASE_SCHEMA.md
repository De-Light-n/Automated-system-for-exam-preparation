# Database Schema Design - ExamNinja

## Огляд архітектури

Система використовує MongoDB з наступною структурою зв'язків:
- **User** → один до багатьох → **StudyMaterial** (теми/конспекти)
- **StudyMaterial** → один до багатьох → **QuizResult** (результати тестів)
- **StudyMaterial** → один до багатьох → **ChatHistory** (історія чатів)
- **User** → один до багатьох → **ChatHistory** (для швидкого доступу)

## 📊 Схема колекцій

### 1. Users (Користувачі)
```typescript
interface User {
  _id: ObjectId;
  email: string;                    // Унікальний email
  username: string;                 // Ім'я користувача
  password?: string;                // Хешований пароль (опційно для OAuth)
  googleId?: string;                // Google OAuth ID
  avatar?: string;                  // URL аватарки
  
  // Статистика користувача
  stats: {
    xp: number;                     // Досвід
    level: string;                  // Рівень (Студент, Бакалавр, Магістр, Професор)
    streak: number;                 // Дні підряд
    lastActiveDate?: Date;          // Остання активність
    achievements: string[];         // Досягнення
    cardsLearned: number;           // Вивчено карток
    testsPassed: number;            // Пройдено тестів
  };
  
  // Системні поля
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

**Індекси:**
- `{ email: 1 }` - унікальний
- `{ googleId: 1 }` - для OAuth
- `{ "stats.xp": -1 }` - для рейтингу

---

### 2. StudyMaterials (Навчальні матеріали / Теми)
```typescript
interface StudyMaterial {
  _id: ObjectId;
  userId: ObjectId;                 // Власник матеріалу (ref: User)
  
  // Основна інформація
  title: string;                    // Назва теми/конспекту
  originalContent: string;          // Оригінальний текст
  summary: string;                  // Стислий зміст (згенерований AI)
  fileName: string;                 // Оригінальна назва файлу
  fileType: string;                 // PDF, DOCX, TXT, PPTX
  
  // Генерований контент
  keyFacts: string[];               // Ключові факти (5-10 пунктів)
  
  flashcards: Array<{
    id: string;                     // Унікальний ID картки
    question: string;               // Питання
    answer: string;                 // Відповідь
    status: 'new' | 'learning' | 'mastered';  // Статус вивчення
    nextReview: number;             // Timestamp наступного повторення
    reviewCount: number;            // Кількість повторень
    lastReviewed?: Date;            // Остання дата повторення
  }>;
  
  mindMap: {
    nodes: Array<{
      id: string;
      label: string;
      level: number;                // Рівень вкладеності (0 = корінь)
      x?: number;                   // Позиція на карті
      y?: number;
    }>;
    edges: Array<{
      from: string;                 // ID початкової ноди
      to: string;                   // ID кінцевої ноди
      label?: string;               // Опис зв'язку
    }>;
  };
  
  glossary: Array<{
    term: string;                   // Термін
    definition: string;             // Визначення
    category?: string;              // Категорія терміну
  }>;
  
  // Метадані
  tags: string[];                   // Теги для пошуку (#математика, #фізика)
  difficulty: 'easy' | 'medium' | 'hard';  // Складність матеріалу
  estimatedTime: number;            // Орієнтовний час на вивчення (хвилини)
  
  // Прогрес
  progress: {
    flashcardsCompleted: number;    // Кількість засвоєних карток
    quizzesTaken: number;           // Пройдено тестів
    lastStudied?: Date;             // Остання дата навчання
    totalStudyTime: number;         // Загальний час вивчення (хвилини)
  };
  
  // Системні поля
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;              // Архівований матеріал
}
```

**Індекси:**
- `{ userId: 1, createdAt: -1 }` - для сортування матеріалів користувача
- `{ userId: 1, tags: 1 }` - для пошуку по тегах
- `{ userId: 1, isArchived: 1 }` - виключення архівних

---

### 3. QuizResults (Результати тестів)
```typescript
interface QuizResult {
  _id: ObjectId;
  userId: ObjectId;                 // Користувач (ref: User)
  materialId: ObjectId;             // Матеріал/тема (ref: StudyMaterial)
  
  // Результати
  score: number;                    // Набрані бали
  maxScore: number;                 // Максимальні бали
  scorePercentage: number;          // Відсоток правильних відповідей
  
  // Деталі тесту
  questions: Array<{
    question: string;
    userAnswer: string[];           // Відповідь користувача (масив для множинного вибору)
    correctAnswer: string[];        // Правильна відповідь
    isCorrect: boolean;
    timeSpent?: number;             // Час на питання (секунди)
  }>;
  
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  
  // Метадані
  timeSpent: number;                // Загальний час (секунди)
  difficulty: 'easy' | 'medium' | 'hard';
  quizType: 'practice' | 'exam' | 'quick';
  
  // Системні поля
  createdAt: Date;
  completedAt: Date;
}
```

**Індекси:**
- `{ userId: 1, materialId: 1, createdAt: -1 }` - історія тестів по темі
- `{ userId: 1, createdAt: -1 }` - всі тести користувача
- `{ materialId: 1 }` - статистика по матеріалу

---

### 4. ChatHistory (Історія чатів з AI)
```typescript
interface ChatHistory {
  _id: ObjectId;
  userId: ObjectId;                 // Користувач (ref: User)
  materialId: ObjectId;             // Пов'язаний матеріал (ref: StudyMaterial)
  
  // Повідомлення
  messages: Array<{
    id: string;                     // Унікальний ID повідомлення
    role: 'user' | 'assistant';     // Відправник
    content: string;                // Текст повідомлення
    timestamp: Date;                // Час відправки
    
    // Додаткові дані
    tokens?: number;                // Кількість токенів
    model?: string;                 // Використана AI модель
  }>;
  
  // Метадані сесії
  sessionTitle: string;             // Назва сесії (генерується з першого питання)
  topic: string;                    // Тема розмови
  totalMessages: number;
  lastMessageAt: Date;
  
  // Системні поля
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}
```

**Індекси:**
- `{ userId: 1, materialId: 1, updatedAt: -1 }` - чати по матеріалу
- `{ userId: 1, updatedAt: -1 }` - всі чати користувача
- `{ userId: 1, isArchived: 1 }` - активні чати

---

### 5. Flashcards (Опційна окрема колекція для розширених можливостей)
```typescript
interface FlashcardProgress {
  _id: ObjectId;
  userId: ObjectId;                 // Користувач (ref: User)
  materialId: ObjectId;             // Матеріал (ref: StudyMaterial)
  flashcardId: string;              // ID картки в масиві StudyMaterial.flashcards
  
  // Алгоритм інтервальних повторень (SM-2)
  easeFactor: number;               // Фактор легкості (2.5 за замовчуванням)
  interval: number;                 // Інтервал повторення (днів)
  repetitions: number;              // Кількість правильних повторень підряд
  
  // Статистика
  totalReviews: number;
  correctReviews: number;
  wrongReviews: number;
  lastQuality: number;              // Остання оцінка якості (0-5)
  
  // Часові мітки
  nextReviewDate: Date;             // Дата наступного повторення
  lastReviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Індекси:**
- `{ userId: 1, materialId: 1, flashcardId: 1 }` - унікальний прогрес картки
- `{ userId: 1, nextReviewDate: 1 }` - картки для повторення сьогодні

---

## 🔗 Зв'язки між колекціями

### Схема зв'язків:
```
User (1)
  ├── StudyMaterials (n)
  │     ├── QuizResults (n)
  │     └── ChatHistory (n)
  ├── QuizResults (n) [для швидкого доступу]
  └── ChatHistory (n) [для швидкого доступу]
```

### Типові запити:

#### 1. Отримати всі матеріали користувача
```javascript
db.studyMaterials.find({ 
  userId: ObjectId("..."),
  isArchived: false 
}).sort({ createdAt: -1 });
```

#### 2. Отримати конкретний матеріал з історією чатів
```javascript
// 1. Отримати матеріал
const material = await db.studyMaterials.findOne({ _id: materialId });

// 2. Отримати чати по цьому матеріалу
const chats = await db.chatHistory.find({ 
  userId: userId,
  materialId: materialId,
  isArchived: false
}).sort({ updatedAt: -1 });
```

#### 3. Отримати результати тестів по темі
```javascript
db.quizResults.find({ 
  userId: ObjectId("..."),
  materialId: ObjectId("...")
}).sort({ createdAt: -1 });
```

#### 4. Отримати картки для повторення сьогодні
```javascript
db.studyMaterials.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $unwind: "$flashcards" },
  { $match: { 
    "flashcards.nextReview": { $lte: Date.now() },
    "flashcards.status": { $ne: "mastered" }
  }}
]);
```

#### 5. Статистика користувача
```javascript
// Підрахунок загальної кількості матеріалів
const totalMaterials = await db.studyMaterials.countDocuments({ userId });

// Підрахунок пройдених тестів
const totalQuizzes = await db.quizResults.countDocuments({ userId });

// Підрахунок активних чатів
const activeChats = await db.chatHistory.countDocuments({ 
  userId, 
  isArchived: false 
});
```

---

## 📈 Оптимізація та найкращі практики

### 1. **Ембеддінг vs Референси**

#### Використовуємо ембеддінг (вбудовані дані):
- ✅ **Flashcards** в `StudyMaterial` - часто читаються разом
- ✅ **MindMap** в `StudyMaterial` - невеликий обсяг даних
- ✅ **Glossary** в `StudyMaterial` - статичний контент
- ✅ **Messages** в `ChatHistory` - логічна одиниця

#### Використовуємо референси (посилання):
- ✅ **User** ← `StudyMaterial` - різні колекції з різною частотою оновлень
- ✅ **StudyMaterial** ← `QuizResult` - необмежена кількість результатів
- ✅ **StudyMaterial** ← `ChatHistory` - необмежена кількість сесій

### 2. **Індекси для продуктивності**
```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 });

// StudyMaterial
db.studyMaterials.createIndex({ userId: 1, createdAt: -1 });
db.studyMaterials.createIndex({ userId: 1, tags: 1 });

// QuizResults
db.quizResults.createIndex({ userId: 1, materialId: 1, createdAt: -1 });

// ChatHistory
db.chatHistory.createIndex({ userId: 1, materialId: 1, updatedAt: -1 });
```

### 3. **Пагінація**
```javascript
// Матеріали з пагінацією
const page = 1;
const limit = 10;

db.studyMaterials
  .find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

### 4. **Агрегація для складних запитів**
```javascript
// Топ-5 найактивніших матеріалів
db.studyMaterials.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $addFields: {
    totalActivity: { 
      $add: [
        "$progress.quizzesTaken", 
        "$progress.flashcardsCompleted"
      ]
    }
  }},
  { $sort: { totalActivity: -1 } },
  { $limit: 5 }
]);
```

---

## 🚀 Міграція та оновлення схеми

### Версіонування схеми
```typescript
interface User {
  _id: ObjectId;
  schemaVersion: number;  // 1, 2, 3...
  // ... інші поля
}
```

### Приклад міграції
```javascript
// Додавання нового поля до всіх користувачів
db.users.updateMany(
  { schemaVersion: { $lt: 2 } },
  { 
    $set: { 
      "stats.cardsLearned": 0,
      "stats.testsPassed": 0,
      schemaVersion: 2 
    }
  }
);
```

---

## 🔐 Безпека даних

### 1. Валідація на рівні схеми (Mongoose)
```typescript
const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: { 
    type: String, 
    minlength: 6 
  }
});
```

### 2. Права доступу
- Користувач може читати/змінювати тільки свої дані
- `userId` завжди перевіряється в backend
- Токен JWT містить `userId` для авторизації

### 3. Сенситивні дані
- Паролі хешуються (bcrypt)
- JWT токени з терміном дії (7 днів)
- Avatar URL - публічний, без прямих файлів

---

## 📊 Приклад даних

### User
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "student@example.com",
  "username": "Іван Петренко",
  "googleId": "110852409614710100505",
  "avatar": "https://lh3.googleusercontent.com/...",
  "stats": {
    "xp": 1250,
    "level": "Бакалавр",
    "streak": 5,
    "lastActiveDate": "2025-11-28T10:00:00.000Z",
    "achievements": ["Перший тест", "Майстер карток"],
    "cardsLearned": 45,
    "testsPassed": 8
  },
  "createdAt": "2025-11-01T08:00:00.000Z",
  "updatedAt": "2025-11-28T10:00:00.000Z"
}
```

### StudyMaterial
```json
{
  "_id": "507f191e810c19729de860ea",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Основи квантової механіки",
  "originalContent": "Квантова механіка...",
  "summary": "Основні принципи квантової механіки включають...",
  "fileName": "quantum_physics.pdf",
  "fileType": "PDF",
  "keyFacts": [
    "Принцип невизначеності Гейзенберга",
    "Хвильова функція описує стан системи"
  ],
  "flashcards": [
    {
      "id": "fc_001",
      "question": "Що таке принцип невизначеності?",
      "answer": "Неможливо одночасно точно виміряти...",
      "status": "learning",
      "nextReview": 1701187200000,
      "reviewCount": 3
    }
  ],
  "mindMap": {
    "nodes": [
      { "id": "root", "label": "Квантова механіка", "level": 0 },
      { "id": "n1", "label": "Принципи", "level": 1 }
    ],
    "edges": [
      { "from": "root", "to": "n1" }
    ]
  },
  "glossary": [
    {
      "term": "Квантова суперпозиція",
      "definition": "Стан системи, що є лінійною комбінацією..."
    }
  ],
  "tags": ["фізика", "квантова механіка"],
  "difficulty": "hard",
  "estimatedTime": 120,
  "progress": {
    "flashcardsCompleted": 2,
    "quizzesTaken": 1,
    "lastStudied": "2025-11-28T09:00:00.000Z",
    "totalStudyTime": 45
  },
  "createdAt": "2025-11-25T14:30:00.000Z",
  "updatedAt": "2025-11-28T09:00:00.000Z",
  "isArchived": false
}
```

---

## 🎯 Висновки та рекомендації

### ✅ Переваги поточної схеми:
1. **Гнучкість** - легко додавати нові типи контенту
2. **Масштабованість** - референси дозволяють необмежену кількість тестів/чатів
3. **Швидкість** - ембеддінг для часто використовуваних даних
4. **Зручність** - одне запит для отримання матеріалу з усім контентом

### 🔄 Можливі покращення:
1. **Окрема колекція Flashcards** - якщо потрібен складний алгоритм повторень
2. **Caching** - Redis для популярних матеріалів
3. **Full-text search** - MongoDB Atlas Search для пошуку по контенту
4. **Analytics** - окрема колекція для детальної аналітики

### 📝 Наступні кроки:
1. Створити Mongoose схеми для всіх колекцій
2. Додати валідацію на рівні БД
3. Реалізувати API endpoints для всіх операцій
4. Додати тести для критичних запитів
