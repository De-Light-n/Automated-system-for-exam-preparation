# Документація API

## Базовий URL

```
http://localhost:8000/api/v1
```

## Аутентифікація

### Реєстрація

```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "username": "student123",
  "password": "securepassword",
  "full_name": "Іванов Іван"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Вхід

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

## Лабораторні роботи

### Отримати список лабораторних

```http
GET /lab-works?student_id=1
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "title": "Лабораторна робота №1",
    "description": "Основи програмування",
    "topic": "Python basics",
    "status": "completed",
    "score": 85,
    "max_score": 100
  }
]
```

### Відправити лабораторну роботу

```http
POST /lab-works/{lab_work_id}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "def hello(): print('Hello World')",
  "files": {
    "main.py": "content..."
  }
}

Response: 200 OK
{
  "message": "Lab work submitted successfully"
}
```

## Аналітика

### Отримати прогрес студента

```http
GET /analytics/student/{student_id}/progress
Authorization: Bearer {token}

Response: 200 OK
{
  "student_id": 1,
  "overall_progress": 75,
  "completed_labs": 8,
  "average_score": 82.5
}
```

### Отримати типові помилки

```http
GET /analytics/student/{student_id}/errors
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "error_type": "SyntaxError",
    "count": 5,
    "description": "Missing colon"
  }
]
```

## Рекомендації

### Отримати персональні рекомендації

```http
GET /recommendations/student/{student_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "weak_topics": [
    {
      "topic": "Recursion",
      "mastery_level": "weak",
      "suggestions": ["Practice more recursive problems"]
    }
  ],
  "study_plan": [
    {
      "task": "Review recursion basics",
      "estimated_hours": 3,
      "priority": "high"
    }
  ],
  "self_check_questions": [
    {
      "question": "What is recursion?",
      "topic": "Recursion"
    }
  ]
}
```

## Екзаменаційний тренажер

### Розпочати екзаменаційну сесію

```http
POST /exam-trainer/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_id": 1,
  "duration_minutes": 60
}

Response: 200 OK
{
  "session_id": 1,
  "start_time": "2025-01-01T10:00:00",
  "end_time": "2025-01-01T11:00:00",
  "questions": [...]
}
```

### Відправити відповідь

```http
POST /exam-trainer/session/{session_id}/answer
Authorization: Bearer {token}
Content-Type: application/json

{
  "question_id": 1,
  "answer": "Option A"
}

Response: 200 OK
{
  "correct": true,
  "explanation": "..."
}
```

### Завершити екзамен

```http
POST /exam-trainer/session/{session_id}/finish
Authorization: Bearer {token}

Response: 200 OK
{
  "total_questions": 20,
  "correct_answers": 17,
  "score": 85,
  "readiness_level": "high"
}
```

## Статистика

### Отримати загальну статистику

```http
GET /statistics/student/{student_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "total_labs": 10,
  "completed_labs": 8,
  "average_score": 82.5,
  "success_rate": 80,
  "topics_mastered": 6
}
```

### Отримати дані для візуалізації

```http
GET /statistics/student/{student_id}/visualization
Authorization: Bearer {token}

Response: 200 OK
{
  "progress_chart": [
    {"week": 1, "score": 65},
    {"week": 2, "score": 72}
  ],
  "topic_breakdown": [
    {"topic": "Basics", "score": 85},
    {"topic": "Advanced", "score": 70}
  ],
  "performance_indicators": {
    "trend": "improving",
    "consistency": "high"
  }
}
```
