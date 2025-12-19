# 🚀 Швидкий гайд по деплою ExamNinja

## ⚡ ЩО РОБИТИ (крок за кроком):

### 1️⃣ BACKEND на Render.com (5 хвилин)

```bash
# 1. Йдемо на https://render.com
# 2. Sign Up через GitHub
# 3. New + → Web Service
# 4. Вибираємо репозиторій
```

**Налаштування:**

- Name: `examninja-backend`
- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Environment Variables (додати в Render):**

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://a7654837383_db_user:4CvH5UZDbYJwYHLg@cluster0.2ft8rbf.mongodb.net/examninja?retryWrites=true&w=majority
JWT_SECRET=тут_згенеруй_32_символи
SESSION_SECRET=тут_теж_згенеруй_32_символи
FRONTEND_URL=поки_залиш_пусте
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=твій_render_url/api/auth/google/callback
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Згенерувати секрети (PowerShell):**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

✅ Після деплою скопіюй URL (типу `https://examninja-backend.onrender.com`)

---

### 2️⃣ FRONTEND на Vercel (3 хвилини)

```bash
# 1. Йдемо на https://vercel.com
# 2. Sign Up через GitHub
# 3. Add New → Project
# 4. Import свій репозиторій
```

**Налаштування:**

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

**Environment Variable (додати в Vercel):**

```
VITE_API_URL=https://examninja-backend.onrender.com
```

(підстав свій URL з Render)

✅ Після деплою скопіюй URL (типу `https://examninja.vercel.app`)

---

### 3️⃣ ОНОВИТИ Backend (1 хвилина)

Йдемо назад в Render → Environment Variables:

```
FRONTEND_URL=https://examninja.vercel.app
```

(підстав свій URL з Vercel)

Render автоматично передеплоїться!

---

### 4️⃣ GOOGLE OAUTH (2 хвилини)

Йдемо в [Google Cloud Console](https://console.cloud.google.com):

1. APIs & Services → Credentials
2. Вибираємо свій OAuth 2.0 Client ID
3. Додаємо в **Authorized JavaScript origins**:
   - `https://examninja.vercel.app`
   - `https://examninja-backend.onrender.com`
4. Додаємо в **Authorized redirect URIs**:
   - `https://examninja-backend.onrender.com/api/auth/google/callback`

---

## ✅ ГОТОВО! Перевірка:

1. Відкрити `https://examninja.vercel.app`
2. Спробувати залогінитись через Google
3. Завантажити файл
4. Перевірити AI чат

---

## 🆓 Альтернативи (теж безплатні):

### Backend:

- **Railway.app** - простіший за Render
- **Fly.io** - швидший
- **Cyclic.sh** - найпростіший

### Frontend:

- **Netlify** - альтернатива Vercel
- **Cloudflare Pages** - найшвидший

---

## 🐛 Якщо щось не працює:

**Backend не запускається:**

```bash
# Перевір логи в Render Dashboard
# Переконайся, що всі env змінні встановлені
```

**Frontend не підключається до Backend:**

```bash
# Перевір CORS в server.ts (вже налаштовано)
# Переконайся, що VITE_API_URL правильний у Vercel
```

**Google OAuth не працює:**

```bash
# Перевір callback URL в Google Console
# Має бути: https://твій-backend-url.onrender.com/api/auth/google/callback
```

---

## 💰 Ціни (безплатні ліміти):

- **Render**: 750 годин/місяць, авто-сплять через 15 хв
- **Vercel**: 100GB bandwidth, 100 deployments/day
- **MongoDB Atlas**: 512MB storage назавжди

---

## 📞 Корисні посилання:

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

---

**Час деплою: ~10 хвилин** ⏱️

**Вартість: $0** 💵
