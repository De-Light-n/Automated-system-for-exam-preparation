# 🚀 ДЕПЛОЙ НА RENDER (ВСЕ НА ОДНОМУ СЕРВЕРІ)

## ⚡ Швидкий старт - 5 хвилин!

### 1️⃣ Підготовка (на локальному комп'ютері)

```powershell
# Перевірити що все працює локально
npm run dev:all
```

Якщо все ОК - йдемо далі! 🚀

---

### 2️⃣ Push на GitHub

```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

### 3️⃣ Створити Web Service на Render

1. Йдемо на **https://render.com**
2. **Sign Up** через GitHub
3. **New +** → **Web Service**
4. Вибираємо свій репозиторій `Automated-system-for-exam-preparation`

---

### 4️⃣ Налаштування сервісу

**Basic Settings:**

```
Name: examninja
Region: Frankfurt (EU Central) або Oregon (US West)
Branch: main
Root Directory: server
Runtime: Node
```

**Build & Deploy:**

```
Build Command: npm install && npm run build
Start Command: npm start
```

**Instance Type:**

```
Free (0.1 CPU, 512 MB RAM) ✅ БЕЗПЛАТНО
```

---

### 5️⃣ Environment Variables (ВАЖЛИВО!)

Натисни **"Add Environment Variable"** і додай:

```bash
NODE_ENV=production
PORT=10000
```

**MongoDB (твоя база вже є):**

```bash
MONGODB_URI=mongodb+srv://a7654837383_db_user:4CvH5UZDbYJwYHLg@cluster0.2ft8rbf.mongodb.net/examninja?retryWrites=true&w=majority
```

**Секрети (згенеруй нові!):**

```bash
JWT_SECRET=<згенеруй_тут>
SESSION_SECRET=<згенеруй_тут>
```

**Згенерувати секрети:**

```powershell
# Запусти у PowerShell:
.\generate-secrets.ps1
```

**Google OAuth:**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Callback URL (підстав свій URL після створення!):**

```bash
GOOGLE_CALLBACK_URL=https://твій-сервіс.onrender.com/api/auth/google/callback
FRONTEND_URL=https://твій-сервіс.onrender.com
```

**AI Keys:**

```bash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

### 6️⃣ Deploy!

1. Натисни **"Create Web Service"**
2. Чекай 5-10 хвилин ⏳
3. Спостерігай за логами у вкладці **"Logs"**

Після деплою побачиш URL типу:

```
https://examninja-xyz.onrender.com
```

---

### 7️⃣ Оновити Google OAuth (ОБОВ'ЯЗКОВО!)

1. Йдемо в **https://console.cloud.google.com**
2. **APIs & Services** → **Credentials**
3. Вибираємо OAuth 2.0 Client ID
4. Додаємо URL:

**Authorized JavaScript origins:**

```
https://examninja-xyz.onrender.com
```

**Authorized redirect URIs:**

```
https://examninja-xyz.onrender.com/api/auth/google/callback
```

5. **Save**

---

### 8️⃣ Оновити змінні на Render

Повертаємось на Render → **Environment** → Редагуємо:

```bash
GOOGLE_CALLBACK_URL=https://examninja-xyz.onrender.com/api/auth/google/callback
FRONTEND_URL=https://examninja-xyz.onrender.com
```

Render автоматично передеплоїться! 🔄

---

## ✅ ПЕРЕВІРКА

1. Відкрити `https://examninja-xyz.onrender.com`
2. Побачити сторінку ExamNinja ✅
3. Спробувати залогінитись через Google ✅
4. Завантажити файл PDF ✅
5. Відкрити AI чат ✅

---

## 🎯 Що тут відбувається?

```
┌─────────────────────────────────────┐
│   https://examninja.onrender.com    │
│                                     │
│  ┌─────────────┐   ┌─────────────┐ │
│  │  Frontend   │   │   Backend   │ │
│  │  (React)    │◄──┤   (Node.js) │ │
│  │  dist/      │   │   API       │ │
│  └─────────────┘   └─────────────┘ │
│                          │          │
└──────────────────────────┼──────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  MongoDB Atlas  │
                  │   (Database)    │
                  └─────────────────┘
```

**Переваги:**

- ✅ Один URL для всього
- ✅ Без CORS проблем
- ✅ Простіше керувати
- ✅ Швидше завантаження
- ✅ БЕЗПЛАТНО!

---

## 💰 Безплатний план Render

- **750 годин/місяць** (достатньо для постійної роботи)
- **512 MB RAM**
- **Автоматичний HTTPS**
- **Автоматичні деплої** з GitHub

⚠️ **Примітка:** Сервіс засинає після 15 хвилин неактивності.
Перший запит після сну займає ~30 секунд.

Для завжди активного сервісу - можна:

1. Апгрейднути до Starter ($7/місяць)
2. Використати ping сервіс (безплатно, але можуть заблокувати)

---

## 🐛 Проблеми?

### Деплой падає

```bash
# Перевір логи в Render Dashboard
# Шукай червоні помилки
# Часто це відсутні environment variables
```

### Frontend не показується

```bash
# Перевір чи створена папка server/dist/public
# Перевір логи build процесу
# Подивись чи є index.html в dist/public
```

### Google OAuth не працює

```bash
# Перевір GOOGLE_CALLBACK_URL в Render
# Перевір що URL додані в Google Console
# Перевір що немає опечаток в URL
```

### База даних не підключається

```bash
# Перевір MONGODB_URI
# Перевір що IP адреса 0.0.0.0/0 дозволена в MongoDB Atlas
```

---

## 🔄 Автоматичний редеплой

Після першого деплою, кожен push на GitHub автоматично оновлює сайт! 🎉

```powershell
git add .
git commit -m "Update feature"
git push
# Render автоматично побачить зміни і задеплоїть!
```

---

## 📊 Моніторинг

**Render Dashboard показує:**

- 📈 CPU/RAM використання
- 📝 Логи в реальному часі
- 🔄 Історію деплоїв
- ⚠️ Помилки та попередження

---

## 🎓 Корисні команди

**Подивитись логи:**

```bash
# У Render Dashboard → Logs
# Або через Render CLI:
render logs -f
```

**Перезапустити сервіс:**

```bash
# Render Dashboard → Manual Deploy → Clear build cache & deploy
```

---

## 💡 Поради

1. **Не комітити .env файли** (вони в .gitignore)
2. **Генеруй нові секрети** для продакшену
3. **Включи 2FA** на Render і GitHub
4. **Регулярно backup бази** (MongoDB Atlas має автобекапи)
5. **Моніторь логи** перші дні після деплою

---

## 🚀 Наступні кроки

- [ ] Додати custom domain (безплатно!)
- [ ] Налаштувати CDN (Cloudflare)
- [ ] Додати monitoring (UptimeRobot)
- [ ] Налаштувати email сповіщення
- [ ] Додати error tracking (Sentry)

---

**Час деплою: 10-15 хвилин** ⏱️

**Вартість: $0** 💰

**Складність: 2/10** 😊

---

## 📞 Потрібна допомога?

- 📖 Render Docs: https://render.com/docs
- 💬 Render Community: https://community.render.com
- 🐛 GitHub Issues: створи issue в репозиторії

---

**Успішного деплою! 🎉**
