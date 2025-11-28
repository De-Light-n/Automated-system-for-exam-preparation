# Налаштування Google OAuth2 🔐

## Отримання Google OAuth креденшелів

### 1. Створення проекту в Google Cloud Console

1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект або виберіть існуючий
3. Перейдіть в розділ **"APIs & Services" → "Credentials"**

### 2. Налаштування OAuth Consent Screen

1. Виберіть **"OAuth consent screen"** в лівому меню
2. Оберіть **"External"** (для тестування) або **"Internal"** (для організацій)
3. Заповніть обов'язкові поля:
   - **App name**: ExamNinja
   - **User support email**: ваш email
   - **Developer contact information**: ваш email
4. Натисніть **"Save and Continue"**
5. На сторінці **"Scopes"** натисніть **"Add or Remove Scopes"**
6. Виберіть:
   - `userinfo.email`
   - `userinfo.profile`
7. Натисніть **"Save and Continue"**
8. Додайте тестових користувачів (ваш Gmail)
9. Натисніть **"Save and Continue"**

### 3. Створення OAuth 2.0 Client ID

1. Перейдіть до **"Credentials"**
2. Натисніть **"+ Create Credentials"** → **"OAuth client ID"**
3. Оберіть тип: **"Web application"**
4. Заповніть:
   - **Name**: ExamNinja Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
5. Натисніть **"Create"**
6. Збережіть:
   - **Client ID** (виглядає як `xxxxx.apps.googleusercontent.com`)
   - **Client Secret**

### 4. Налаштування змінних оточення

#### Backend (`server/.env`)

```env
# Google OAuth2
GOOGLE_CLIENT_ID=ваш_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (для redirect після OAuth)
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/examninja

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_for_security
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret_key_change_in_production
```

#### Frontend (`.env`)

```env
# API URL
VITE_API_URL=http://localhost:5000/api

# Gemini API (для AI функцій)
GEMINI_API_KEY=your_gemini_api_key
```

---

## Запуск проекту

### 1. Backend

```bash
cd server
npm install
npm run dev
```

Сервер запуститься на `http://localhost:5000`

### 2. Frontend

```bash
npm install
npm run dev
```

Frontend запуститься на `http://localhost:3000`

---

## Як працює OAuth flow

1. **Користувач натискає "Увійти через Google"**

   - Frontend перенаправляє на: `http://localhost:5000/api/auth/google`

2. **Google авторизація**

   - Passport.js перенаправляє на Google
   - Користувач авторизується в Google
   - Google повертає на callback URL

3. **Callback обробка**

   - Backend отримує дані користувача від Google
   - Створює або оновлює користувача в MongoDB
   - Генерує JWT токен
   - Перенаправляє на: `http://localhost:3000/auth/callback?token=xxx`

4. **Frontend обробка**
   - Компонент `AuthCallback` витягує токен з URL
   - Зберігає токен в localStorage
   - Завантажує дані користувача
   - Перенаправляє на головну сторінку

---

## Тестування

1. Відкрийте `http://localhost:3000`
2. Натисніть кнопку "Увійти" або іконку профілю
3. Натисніть "Увійти через Google"
4. Авторизуйтесь через Google
5. Після успішної авторизації ви побачите свій профіль

---

## Production налаштування

Для production змініть:

### Google Cloud Console

**Authorized JavaScript origins:**

```
https://your-domain.com
```

**Authorized redirect URIs:**

```
https://your-domain.com/api/auth/google/callback
```

### Backend `.env`

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
```

---

## Troubleshooting

### Помилка "redirect_uri_mismatch"

- Перевірте що redirect URI в Google Console співпадає з `GOOGLE_CALLBACK_URL` в `.env`
- Переконайтесь що порт збігається (5000)

### Помилка "access_denied"

- Перевірте що ваш email додано до тестових користувачів в OAuth Consent Screen

### Токен не зберігається

- Перевірте що browser не блокує cookies
- Перевірте CORS налаштування в `server.ts`

### MongoDB помилки

- Переконайтесь що MongoDB запущено: `mongod`
- Перевірте `MONGODB_URI` в `.env`

---

## Структура БД

Після першого входу через Google в MongoDB створюється користувач:

```json
{
  "_id": "ObjectId",
  "email": "user@gmail.com",
  "username": "User Name",
  "avatar": "https://lh3.googleusercontent.com/...",
  "password": "random_hash",
  "stats": {
    "xp": 0,
    "level": "Студент",
    "streak": 0,
    "achievements": [],
    "cardsLearned": 0,
    "testsPassed": 0
  },
  "createdAt": "2025-11-28T...",
  "updatedAt": "2025-11-28T..."
}
```

**Готово!** 🎉 Тепер у вас працює повноцінна авторизація через Google OAuth2 + JWT!
