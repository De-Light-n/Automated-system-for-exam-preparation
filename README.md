# 📚 ExamNinja - Automated System for Exam Preparation

> Автоматизована система для підготовки до іспитів з AI-аналізом навчальних матеріалів та персоналізованими рекомендаціями.

[![Status](https://img.shields.io/badge/status-MVP-green)](PROJECT_STATUS.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933)](https://nodejs.org/)

---

## 🎯 Основні функції

### ✅ Реалізовано (MVP)

1. **🤖 AI-обробка матеріалів**
   - Завантаження PDF, DOCX, TXT файлів
   - Автоматична генерація стислого змісту
   - Виділення ключових фактів
   - AI-powered аналіз через Google Gemini

2. **📝 Інтерактивні тести (Quiz)**
   - Автоматична генерація питань з матеріалу
   - Різні типи питань (ABC, matching)
   - Миттєве оцінювання
   - Збереження результатів

3. **🎴 Флеш-картки з інтервальним повторенням**
   - Автоматичне створення карток
   - Система spaced repetition
   - Відстеження прогресу
   - Статуси: new → learning → mastered

4. **👤 Система автентифікації**
   - Реєстрація та вхід
   - JWT authentication
   - Профіль користувача
   - Збереження прогресу

5. **📊 Дашборд прогресу**
   - XP та система рівнів
   - Статистика навчання
   - Відстеження досягнень

### 🚧 В розробці

- Mind Map візуалізація
- Словник термінів (Glossary)
- AI Chat асистент
- Розширена статистика
- Екзаменаційний тренажер

---

## 🛠️ Технології

### Frontend
- **React 19.2** - UI фреймворк
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool
- **Lucide React** - Іконки
- **PDF.js** - PDF обробка
- **Mammoth.js** - DOCX обробка

### Backend
- **Node.js + Express** - Server
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security

### AI Integration
- **Google Gemini** - Text generation
- **Grok API** - Additional AI
- **OpenRouter** - AI routing

---

## 📁 Структура проекту

```
├── components/          # React компоненти
│   ├── Header.tsx      # Навігація та статистика
│   ├── Quiz.tsx        # Компонент тестів
│   └── Flashcards.tsx  # Флеш-картки
├── server/             # Backend (Node.js)
│   └── src/
│       ├── routes/     # API endpoints
│       ├── models/     # Mongoose models
│       ├── middleware/ # Auth, validation
│       └── config/     # Конфігурація
├── services/           # AI сервіси
│   ├── geminiService.ts
│   └── grokService.ts
├── types.ts            # TypeScript типи
└── App.tsx            # Головний компонент
```

---

## 🚀 Запуск проекту

### Передумови
- Node.js 18+ та npm
- MongoDB (локально або cloud)
- Google Gemini API key

### 1. Клонування репозиторію

```bash
git clone https://github.com/De-Light-n/Automated-system-for-exam-preparation.git
cd Automated-system-for-exam-preparation
```

### 2. Налаштування Backend

```bash
# Перейти в папку server
cd server

# Встановити залежності
npm install

# Створити .env файл
cp .env.example .env

# Додати до .env:
# MONGODB_URI=mongodb://localhost:27017/examninja
# JWT_SECRET=your-secret-key
# GEMINI_API_KEY=your-gemini-key

# Запустити сервер
npm run dev
```

Backend буде доступний на `http://localhost:3001`

### 3. Налаштування Frontend

```bash
# Повернутись в корінь проекту
cd ..

# Встановити залежності
npm install

# Запустити dev сервер
npm run dev
```

Frontend буде доступний на `http://localhost:5173`

### 4. Запуск разом

```bash
# З кореня проекту
npm run dev:all
```

Це запустить і frontend, і backend одночасно.

---

## 📖 Документація

### Для розробників
- **[TICKET_ORGANIZATION.md](TICKET_ORGANIZATION.md)** - Детальний аналіз усіх тікетів проекту
- **[TICKET_ACTION_PLAN.md](TICKET_ACTION_PLAN.md)** - Покроковий план організації робіт
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Поточний статус та метрики проекту

### Корисні посилання
- [GitHub Issues](https://github.com/De-Light-n/Automated-system-for-exam-preparation/issues) - Відкриті задачі
- [QUICKSTART.md](QUICKSTART.md) - Швидкий старт

---

## 👥 Команда розробників

| Ім'я | Роль | Фокус |
|------|------|-------|
| **Яйко Назар** | Frontend Lead | UI/UX, Components |
| **Іванчук Орест** | Frontend Dev | Flashcards, Chat |
| **Качмар Ігор** | Backend Lead | API, Security, Testing |
| **Манюк Руслан** | Backend Dev | AI/NLP Integration |
| **Чігур Володимір** | DevOps | Infrastructure, CI/CD |

---

## 📊 Поточний статус проекту

```
MVP Progress: ████████████████████░░░░ 75%

✅ Завершено: 11 features
🔨 В роботі:   3 features  
📋 Заплановано: 23+ features
```

Детальніше: [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## 🤝 Внесок у проект

Ми раді вашому внеску! Будь ласка:

1. Fork репозиторій
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

**Перед створенням PR:**
- Перевірте [TICKET_ORGANIZATION.md](TICKET_ORGANIZATION.md) для актуальних задач
- Переконайтесь що код проходить linting
- Додайте тести для нової функціональності

---

## 📝 Ліцензія

Цей проект створено для навчальних цілей.

---

## 📞 Контакти

**GitHub:** [De-Light-n/Automated-system-for-exam-preparation](https://github.com/De-Light-n/Automated-system-for-exam-preparation)

**Issues:** [Створити Issue](https://github.com/De-Light-n/Automated-system-for-exam-preparation/issues/new)

---

**Останнє оновлення:** 22.11.2025 | **Версія:** 0.75 (MVP)
