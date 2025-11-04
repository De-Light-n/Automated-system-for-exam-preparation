# Інструкція по запуску Backend (FastAPI)

## Передумови

- Python 3.9 або вище
- PostgreSQL

## Крок 1: Створення віртуального середовища

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

## Крок 2: Встановлення залежностей

```powershell
pip install -r requirements.txt
```

## Крок 3: Налаштування бази даних

1. Створіть базу даних PostgreSQL:

```sql
CREATE DATABASE exam_prep_db;
```

2. Скопіюйте `.env.example` в `.env`:

```powershell
Copy-Item .env.example .env
```

3. Відредагуйте `.env` файл і вкажіть правильні налаштування бази даних:

```
DATABASE_URL=postgresql://username:password@localhost:5432/exam_prep_db
SECRET_KEY=your-secret-key-here
```

## Крок 4: Запуск сервера

```powershell
uvicorn app.main:app --reload
```

Сервер буде доступний за адресою: http://localhost:8000

API документація: http://localhost:8000/docs

## Структура backend

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/      # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── students.py
│   │   │   ├── lab_works.py
│   │   │   ├── analytics.py
│   │   │   ├── recommendations.py
│   │   │   ├── exam_trainer.py
│   │   │   └── statistics.py
│   │   └── routes.py       # Головний роутер
│   ├── core/
│   │   ├── config.py       # Налаштування
│   │   └── database.py     # Підключення до БД
│   ├── models/             # SQLAlchemy моделі
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── lab_work.py
│   │   └── exam.py
│   ├── schemas/            # Pydantic схеми
│   │   ├── auth.py
│   │   ├── student.py
│   │   └── lab_work.py
│   ├── services/           # Бізнес логіка
│   │   └── auth_service.py
│   └── main.py             # Точка входу
├── requirements.txt
└── .env.example
```
