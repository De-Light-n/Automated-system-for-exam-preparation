# 🚀 Деплой на Render (все на одному сервері)

## Варіант 1: Монолітний деплой (Frontend + Backend разом)

### Підготовка проекту

1. **Додати build скрипт для frontend в server/package.json**

2. **Налаштувати статичну роздачу frontend з backend**

3. **Один Web Service на Render**

---

## 📝 Крок 1: Оновити структуру

### server/package.json - додати скрипти:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "npm run build:backend && npm run build:frontend",
  "build:backend": "tsc",
  "build:frontend": "cd .. && npm install && npm run build && mkdir -p server/dist/public && cp -r dist/* server/dist/public/",
  "start": "node dist/server.js",
  "postinstall": "cd .. && npm install"
}
```

### server/src/server.ts - додати роздачу статики:

```typescript
// Після всіх API routes, перед error handlers
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}
```

---

## 🚀 Крок 2: Деплой на Render

### Налаштування Web Service:

1. Йдемо на [render.com](https://render.com)
2. New + → Web Service
3. Підключаємо репозиторій

**Конфігурація:**

```
Name: examninja
Root Directory: server
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables:**

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://a7654837383_db_user:4CvH5UZDbYJwYHLg@cluster0.2ft8rbf.mongodb.net/examninja?retryWrites=true&w=majority
JWT_SECRET=<згенеруй_32_символи>
SESSION_SECRET=<згенеруй_32_символи>
FRONTEND_URL=https://examninja.onrender.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://examninja.onrender.com/api/auth/google/callback
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## 📋 Крок 3: Оновити Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Додати:
   - **Authorized JavaScript origins**: `https://examninja.onrender.com`
   - **Authorized redirect URIs**: `https://examninja.onrender.com/api/auth/google/callback`

---

## ✅ Готово!

Тепер все (frontend + backend) працює на одному URL:

- `https://examninja.onrender.com` - frontend
- `https://examninja.onrender.com/api/*` - backend API

---

## ⚡ Переваги:

- ✅ Один домен - без CORS проблем
- ✅ Один сервіс - простіше керувати
- ✅ Безплатно на Render (750 годин/місяць)
- ✅ Автоматичний HTTPS

---

## 🐛 Якщо не працює:

**Перевірити логи:**

```bash
# У Render Dashboard → Logs
# Шукати помилки build або runtime
```

**Перевірити файли:**

```bash
# Переконатись що dist/public створена
# Переконатись що index.html на місці
```

---

## 💡 Альтернатива: Docker контейнер

Можна також створити Dockerfile для всього проекту.
