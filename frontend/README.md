# Інструкція по запуску Frontend (React)

## Передумови

- Node.js 16 або вище
- npm або yarn

## Крок 1: Встановлення залежностей

```powershell
cd frontend
npm install
```

## Крок 2: Налаштування (опціонально)

Створіть `.env` файл для налаштування:

```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Крок 3: Запуск dev сервера

```powershell
npm start
```

Застосунок буде доступний за адресою: http://localhost:3000

## Структура frontend

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.js          # Головний layout з навігацією
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js       # Головна сторінка
│   │   ├── Auth/
│   │   │   ├── Login.js           # Вхід
│   │   │   └── Register.js        # Реєстрація
│   │   ├── LabWorks/
│   │   │   ├── LabWorks.js        # Список лабораторних
│   │   │   └── LabWorkDetail.js   # Деталі лабораторної
│   │   ├── Analytics/
│   │   │   └── Analytics.js       # Аналітика та графіки
│   │   ├── Recommendations/
│   │   │   └── Recommendations.js # Рекомендації
│   │   ├── ExamTrainer/
│   │   │   └── ExamTrainer.js     # Тренажер
│   │   └── Profile/
│   │       └── Profile.js         # Профіль
│   ├── services/
│   │   ├── api.js                 # Axios instance
│   │   └── authService.js         # Auth сервіс
│   ├── App.js                     # Головний компонент
│   ├── index.js                   # Точка входу
│   └── index.css
└── package.json
```

## Доступні скрипти

- `npm start` - Запуск dev сервера
- `npm build` - Збірка для production
- `npm test` - Запуск тестів
