# 🚀 ШВИДКА ШПАРГАЛКА - ДЕПЛОЙ НА RENDER

## 📋 Що потрібно:

1. ✅ GitHub акаунт
2. ✅ Render.com акаунт (безплатно)
3. ✅ 10 хвилин часу

---

## ⚡ КРОК ЗА КРОКОМ:

### 1. Push на GitHub

```powershell
git add .
git commit -m "Ready for deploy"
git push
```

### 2. На Render.com

1. Sign Up через GitHub
2. New + → Web Service
3. Вибрати репозиторій

### 3. Налаштування

```
Root Directory: server
Build: npm install && npm run build
Start: npm start
```

### 4. Environment Variables

Скопіюй і вставляй по одній:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://a7654837383_db_user:4CvH5UZDbYJwYHLg@cluster0.2ft8rbf.mongodb.net/examninja?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Згенеруй секрети:**

```powershell
.\generate-secrets.ps1
```

Додай:

```bash
JWT_SECRET=згенерований_секрет
SESSION_SECRET=згенерований_секрет
```

### 5. Create Web Service

Чекай 5-10 хвилин ⏳

### 6. Після деплою

Скопіюй свій URL (наприклад: `https://examninja-abc.onrender.com`)

Додай ще 2 змінні на Render:

```bash
FRONTEND_URL=https://твій-url.onrender.com
GOOGLE_CALLBACK_URL=https://твій-url.onrender.com/api/auth/google/callback
```

### 7. Google Console

https://console.cloud.google.com
→ APIs & Services → Credentials → OAuth 2.0

**Додати:**

- Origins: `https://твій-url.onrender.com`
- Redirect: `https://твій-url.onrender.com/api/auth/google/callback`

---

## ✅ ГОТОВО!

Відкрий `https://твій-url.onrender.com`

---

## 🆘 Не працює?

**Білд падає:**

- Перевір логи
- Перевір env змінні

**Frontend не показується:**

- Почекай ще 2-3 хвилини
- Перевір логи на помилки

**OAuth не працює:**

- Перевір callback URL
- Перевір Google Console

---

**Деталі:** `DEPLOY_ONE_SERVER_UA.md`
