# ExamNinja - Deployment на Render (2 сервера)

## 🚀 Backend Server

### Крок 1: Створити Web Service
1. render.com → New + → Web Service
2. Підключити репо: `Automated-system-for-exam-preparation`
3. Гілка: `deploy-clean`

### Налаштування:
```
Name: examninja-backend
Region: Frankfurt (EU Central)
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free
```

### Environment Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://a7654837383_db_user:4CvH5UZDbYJwYHLg@cluster0.2ft8rbf.mongodb.net/examninja
JWT_SECRET=<згенеруй_32_символи>
JWT_EXPIRE=7d
SESSION_SECRET=<згенеруй_32_символи>
FRONTEND_URL=https://examninja-frontend.onrender.com
GOOGLE_CLIENT_ID=<твій_google_client_id>
GOOGLE_CLIENT_SECRET=<твій_google_client_secret>
GOOGLE_CALLBACK_URL=https://examninja-backend.onrender.com/api/auth/google/callback
GROQ_API_KEY=<твій_groq_api_key>
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=<твій_openrouter_api_key>
```

**Згенерувати секрети:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**URL:** https://examninja-backend.onrender.com

---

## 🌐 Frontend Server (Static Site)

### Крок 2: Створити Static Site
1. render.com → New + → Static Site
2. Підключити той самий репо
3. Гілка: `deploy-clean`

### Налаштування:
```
Name: examninja-frontend
Root Directory: ./
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables:
```env
VITE_API_URL=https://examninja-backend.onrender.com
```

**URL:** https://examninja-frontend.onrender.com

---

## ✅ Після деплою

1. **Оновити Backend FRONTEND_URL:**
   - `FRONTEND_URL=https://examninja-frontend.onrender.com`

2. **Google Console:**
   - Origins: `https://examninja-frontend.onrender.com`
   - Redirect: `https://examninja-backend.onrender.com/api/auth/google/callback`

---

**Час:** 20 хвилин  
**Вартість:** $0 (обидва Free tier)
