# 🎉 OAuth2 + JWT Авторизація - Реалізовано!

## ✅ Що було зроблено

### 1. **Backend Infrastructure**

- ✅ Встановлено Passport.js, Google OAuth2 стратегію, express-session
- ✅ Створено `server/src/config/passport.ts` - конфігурація Google OAuth
- ✅ Оновлено `server/src/routes/auth.ts`:
  - `GET /api/auth/google` - ініціація OAuth
  - `GET /api/auth/google/callback` - обробка callback
  - `GET /api/auth/profile` - отримання профілю (захищено JWT)
- ✅ Додано підтримку `avatar` в User моделі
- ✅ Оновлено `server.ts` з Passport middleware
- ✅ Всі API роути захищені JWT middleware (materials, quiz, chat)

### 2. **Frontend Infrastructure**

- ✅ Створено `context/AuthContext.tsx` - глобальний стан авторизації
- ✅ Оновлено `services/apiClient.ts` з методом `setAuthToken()`
- ✅ Створено `components/AuthCallback.tsx` - обробка OAuth redirect
- ✅ Оновлено `components/AuthModal.tsx` - додано кнопку "Увійти через Google"
- ✅ Інтегровано `AuthProvider` в `index.tsx`
- ✅ Оновлено `App.tsx` для використання `useAuth()` hook

### 3. **Database**

- ✅ MongoDB моделі готові для зберігання:
  - **Users** - з OAuth підтримкою
  - **StudyMaterials** - прив'язані до userId
  - **QuizResults** - прив'язані до userId
  - **ChatHistory** - прив'язана до userId

### 4. **Документація**

- ✅ Створено `GOOGLE_OAUTH_SETUP.md` - повна інструкція налаштування
- ✅ Створено `server/.env.example` - приклад змінних оточення

---

## 🚀 Швидкий старт

### Крок 1: Налаштуйте Google OAuth

Дотримуйтесь інструкцій в `GOOGLE_OAUTH_SETUP.md`

### Крок 2: Створіть `.env` файли

#### `server/.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/examninja
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GEMINI_API_KEY=your_gemini_key
```

#### `.env` (root)

```env
VITE_API_URL=http://localhost:5000/api
GEMINI_API_KEY=your_gemini_key
```

### Крок 3: Запустіть MongoDB

```bash
mongod
```

### Крок 4: Запустіть Backend

```bash
cd server
npm install
npm run dev
```

### Крок 5: Запустіть Frontend

```bash
npm install
npm run dev
```

### Крок 6: Тестуйте!

1. Відкрийте http://localhost:3000
2. Натисніть "Увійти через Google"
3. Авторизуйтесь
4. Profit! 🎉

---

## 📊 Як працює збереження даних

### Після авторизації

**Всі дані користувача зберігаються в MongoDB:**

```javascript
// Завантаження файлу → зберігається в StudyMaterials
POST /api/materials
{
  userId: "user_id",
  title: "Назва файлу",
  flashcards: [...],
  mindMap: {...},
  glossary: [...]
}

// Проходження тесту → зберігається в QuizResults
POST /api/quiz
{
  userId: "user_id",
  materialId: "material_id",
  score: 85,
  answers: [...]
}

// Оновлення статистики → зберігається в User
PATCH /api/users/stats
{
  xpDelta: 50,
  cardsLearned: 10
}
```

### Отримання даних користувача

```javascript
// Отримати всі матеріали користувача
GET /api/materials
Authorization: Bearer <jwt_token>

// Отримати історію тестів
GET /api/quiz
Authorization: Bearer <jwt_token>

// Отримати чат історію
GET /api/chat/:materialId
Authorization: Bearer <jwt_token>
```

---

## 🔐 Безпека

### JWT Tokens

- Токен зберігається в `localStorage`
- Автоматично додається до всіх API запитів
- Термін дії: 7 днів (налаштовується в JWT_EXPIRE)

### Захищені роути

Всі роути що працюють з даними користувача захищені:

- `/api/materials/*`
- `/api/quiz/*`
- `/api/chat/*`
- `/api/users/*`

### OAuth Flow

1. User → Frontend → Backend → Google
2. Google → Backend (з user data)
3. Backend → MongoDB (створ/оновлення user)
4. Backend → Frontend (з JWT token)
5. Frontend → зберігає token → готово!

---

## 🎯 Що далі можна додати

### Короткострокові покращення (1-2 год)

- [ ] Відображення аватарки користувача в Header
- [ ] Показувати ім'я користувача замість "Студент"
- [ ] Dropdown меню профілю з "Вийти"
- [ ] Loading state при авторизації

### Середньострокові (3-5 год)

- [ ] Сторінка профілю користувача
- [ ] Історія всіх матеріалів
- [ ] Історія всіх тестів з графіками
- [ ] Налаштування профілю (зміна імені, аватарки)

### Довгострокові (1-2 дні)

- [ ] Email верифікація
- [ ] Відновлення пароля
- [ ] 2FA (Two-Factor Authentication)
- [ ] GitHub OAuth (аналогічно Google)
- [ ] Sharing матеріалів між користувачами

---

## 🐛 Можливі проблеми

### "Cannot find module passport"

```bash
cd server
npm install passport passport-google-oauth20 express-session cookie-parser
```

### "Unauthorized" при API запитах

- Перевірте що токен зберігається в localStorage
- Перевірте що `Authorization: Bearer <token>` header додається

### OAuth redirect не працює

- Перевірте `GOOGLE_CALLBACK_URL` в `.env`
- Перевірте що URL співпадає в Google Console

### MongoDB connection failed

- Запустіть MongoDB: `mongod`
- Перевірте `MONGODB_URI` в `.env`

---

## 📝 API Endpoints

### Auth

- `POST /api/auth/register` - реєстрація (email/password)
- `POST /api/auth/login` - вхід (email/password)
- `GET /api/auth/google` - OAuth через Google
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/profile` - отримати профіль (🔒 захищено)

### Materials

- `GET /api/materials` - список матеріалів користувача (🔒)
- `POST /api/materials` - створити матеріал (🔒)
- `GET /api/materials/:id` - отримати матеріал (🔒)
- `PATCH /api/materials/:id` - оновити матеріал (🔒)
- `DELETE /api/materials/:id` - видалити матеріал (🔒)

### Quiz

- `POST /api/quiz` - зберегти результат (🔒)
- `GET /api/quiz/material/:id` - результати по матеріалу (🔒)
- `GET /api/quiz` - всі результати користувача (🔒)

### Chat

- `GET /api/chat/:materialId` - історія чату (🔒)
- `POST /api/chat/:materialId/messages` - додати повідомлення (🔒)
- `DELETE /api/chat/:materialId` - очистити історію (🔒)

### Users

- `GET /api/users/me` - мої дані (🔒)
- `PATCH /api/users/stats` - оновити статистику (🔒)
- `POST /api/users/achievements` - додати досягнення (🔒)

---

## 🎨 Frontend Hooks

### useAuth()

```typescript
const {
  user, // Об'єкт користувача
  token, // JWT токен
  isAuthenticated, // true/false
  loading, // true під час перевірки токена
  login, // функція логіну
  register, // функція реєстрації
  logout, // функція виходу
  updateUserStats, // оновити статистику
} = useAuth();
```

### Приклад використання

```typescript
// Перевірка авторизації
if (!isAuthenticated) {
  return <AuthModal />;
}

// Відображення даних користувача
<p>Привіт, {user.username}!</p>
<p>XP: {user.stats.xp}</p>

// Logout
<button onClick={logout}>Вийти</button>
```

---

**Готово!** 🚀 Тепер у вас повноцінна система авторизації з:

- ✅ Google OAuth2
- ✅ JWT токени
- ✅ MongoDB для зберігання
- ✅ Захищені API роути
- ✅ React Context для стану

**Наступний крок:** Налаштуйте Google OAuth credentials та тестуйте! 🎯
