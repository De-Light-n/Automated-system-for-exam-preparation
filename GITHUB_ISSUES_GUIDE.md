# 🎫 GitHub Issues Quick Reference

Швидка довідка для роботи з тікетами в проекті ExamNinja.

---

## 🏷️ Issue Labels

### Тип (Type)
```
🐛 bug           - Помилки в коді
✨ enhancement   - Нові features
📚 documentation - Документація
🧪 testing       - Тести
🔐 security      - Безпека
⚡ performance   - Оптимізація
♻️  refactor     - Рефакторинг
🎨 design        - UI/UX
🚀 devops        - Infrastructure
♿ accessibility - Доступність
```

### Пріоритет (Priority)
```
🔴 priority: critical  - Блокує розробку/продакшн
🟠 priority: high      - Важливо для релізу
🟡 priority: medium    - Бажано мати
🟢 priority: low       - Nice to have
```

### Область (Area)
```
💻 area: frontend   - React/TypeScript
⚙️  area: backend    - Node.js/Express
🤖 area: ai         - AI/ML
💾 area: database   - MongoDB
🌐 area: api        - REST API
```

### Складність (Complexity)
```
🟢 complexity: easy    - 1-3 SP (1-4 год)
🟡 complexity: medium  - 5-8 SP (1-2 дні)
🟠 complexity: hard    - 13-21 SP (3-5 днів)
🔴 complexity: epic    - 21+ SP (1+ тиждень)
```

### Статус (Status)
```
📋 status: backlog      - Не розпочато
🔨 status: in-progress  - В роботі
👀 status: review       - На код-рев'ю
🚫 status: blocked      - Заблоковано
✅ status: done         - Виконано
```

---

## 📝 Issue Template

```markdown
**Title:** [TYPE] Короткий опис (50 chars max)

**Labels:** type, priority, area, complexity

## 📋 Опис
Детальний опис проблеми або feature.

## 🎯 Мотивація
Чому це потрібно? Яку проблему вирішує?

## ✅ Завдання
- [ ] Завдання 1
- [ ] Завдання 2
- [ ] Завдання 3

## ✔️ Критерії прийняття
- [ ] Критерій 1
- [ ] Критерій 2
- [ ] Критерій 3

## 🔧 Технічні деталі
Будь-яка релевантна технічна інформація.

## ⏱️ Оцінка часу
X-Y годин / SP

## 🔗 Пов'язані Issues
#123, #456

**Assignee:** @username
**Milestone:** vX.X
```

---

## 🎯 Приклади Назв Issues

### ✅ Добре
```
✨ [FEATURE] Add dark mode toggle to settings
🐛 [BUG] Quiz component crashes on empty questions array
📚 [DOCS] Document authentication API endpoints
🧪 [TEST] Add E2E tests for flashcard flow
🔐 [SECURITY] Implement rate limiting on auth endpoints
```

### ❌ Погано
```
Add feature           - Не конкретно
Fix bug              - Що саме?
Update docs          - Які docs?
Need tests           - Для чого?
Security issue       - Яка саме проблема?
```

---

## 🔄 Workflow States

```
New Issue Created
    ↓
[📋 Backlog] - Triage: add labels, assign, estimate
    ↓
[🔜 To Do] - Ready to start, all info available
    ↓
[🔨 In Progress] - Developer working on it
    ↓
[👀 Review] - PR created, awaiting review
    ↓
[✅ Done] - Merged and deployed
    ↓
Close Issue
```

---

## 👥 Призначення (Assignment)

### Коли призначати
- ✅ Коли хтось починає працювати
- ✅ Під час sprint planning
- ✅ Для критичних issues відразу

### Кому призначати
- **Frontend Issues** → Назар, Орест
- **Backend Issues** → Ігор, Руслан  
- **AI/NLP Issues** → Руслан
- **DevOps Issues** → Володимир
- **Security Issues** → Ігор
- **Design Issues** → Назар

---

## 📊 Story Points Guide

```
1 SP  = 1-2 год   - Дрібне виправлення, мінімальні зміни
2 SP  = 2-4 год   - Невеликий feature, простий компонент
3 SP  = 4-6 год   - Середній feature, кілька файлів
5 SP  = 1 день    - Складний компонент, багато логіки
8 SP  = 2 дні     - Великий feature, backend + frontend
13 SP = 3-5 днів  - Велика фіча, багато компонентів
21 SP = 1 тиждень - Epic, потребує дизайну та планування
```

---

## 🎨 Priority Guidelines

### 🔴 Critical
- Додаток не запускається
- Security vulnerability
- Data loss можливість
- Production down

### 🟠 High  
- Блокує інші features
- Важливо для MVP/релізу
- Погіршує UX значно
- Requested by users багато разів

### 🟡 Medium
- Nice to have for release
- Покращує UX
- Технічний борг
- Документація

### 🟢 Low
- Future enhancement
- Оптимізація не критична
- Косметичні зміни

---

## 📝 Comment Best Practices

### ✅ Добре
```
Update: Completed task 1 and 2. Task 3 blocked by #123.
Question: Should we use library X or Y for this? @teammate
Decision: Going with approach A because of performance.
Progress: 60% done, ETA 2 days.
```

### ❌ Погано
```
Working on it       - Занадто загально
Will do later       - Коли саме?
Done                - Що саме зроблено?
???                 - Неінформативно
```

---

## 🔗 Linking Issues

### В коментарях
```
Fixes #123          - Автоматично закриє #123 при merge
Closes #456         - Те саме
Resolves #789       - Те саме
Related to #111     - Просто посилання
Duplicate of #222   - Позначити дублікат
Blocked by #333     - Залежність
```

### В PR description
```
Closes #1, #2, #3   - Закриє кілька issues
Part of #4          - Частина більшого issue
```

---

## 🎯 Milestones

### Поточні
- **v0.5 - MVP Complete** (Due: 2 weeks)
  - Critical bugs fixed
  - Core components complete
  - Basic testing

- **v1.0 - Beta Launch** (Due: 1 month)
  - All planned features
  - Full test coverage
  - Documentation

- **v2.0 - Production** (Due: 2 months)
  - Performance optimized
  - Security hardened
  - Mobile ready

---

## 📊 Using Project Boards

### Columns
```
📋 Backlog        - Нові та заплановані
🔜 Ready          - Готові до роботи
🔨 In Progress    - Активно в роботі (WIP limit: 3)
👀 Review         - На код-рев'ю
✅ Done           - Завершено в спринті
```

### Cards
- Перетягуй issue між колонками
- Додавай notes для швидких ідей
- Конвертуй notes в issues

---

## 🔍 Searching Issues

### Filters
```
is:open                    - Відкриті
is:closed                  - Закриті
is:issue                   - Тільки issues
label:bug                  - З label bug
label:"priority: high"     - High priority
assignee:username          - Призначені юзеру
no:assignee               - Без assignee
milestone:"v1.0"          - В milestone
created:>2025-11-01       - Створені після дати
updated:<2025-11-15       - Оновлені до дати
```

### Combinations
```
is:open label:bug assignee:@me
is:open label:"priority: critical" no:assignee
is:open milestone:"v1.0" label:enhancement
```

---

## ⚡ Quick Actions

### Create Issue
```
1. Click "New Issue"
2. Choose template (if available)
3. Fill in title and description
4. Add labels, assignee, milestone
5. Submit
```

### Close Issue
```
Option 1: Comment "Completed" and click "Close issue"
Option 2: Merge PR with "Closes #123" in description
Option 3: Bulk close via project board
```

### Bulk Actions
```
1. Select multiple issues (checkbox)
2. Apply label/milestone to all
3. Assign to same person
4. Close all
```

---

## 📅 Regular Maintenance

### Daily
- [ ] Triage new issues (5 min)
- [ ] Update in-progress issues (2 min)
- [ ] Check blocked issues (2 min)

### Weekly
- [ ] Sprint planning (30 min)
- [ ] Close completed issues (10 min)
- [ ] Review backlog priorities (15 min)
- [ ] Update project board (10 min)

### Monthly
- [ ] Archive old/stale issues (20 min)
- [ ] Review metrics (20 min)
- [ ] Update milestones (15 min)
- [ ] Retrospective (1 hour)

---

## 🎓 Tips & Tricks

1. **Use templates** - Створи issue templates для consistency
2. **Reference часто** - Link issues, PRs, commits
3. **Be specific** - Детальні описи економлять час
4. **Update regularly** - Progress comments важливі
5. **Close proactively** - Не залишай old issues відкритими
6. **Use reactions** - 👍 👎 для швидкого feedback
7. **Subscribe wisely** - Watch тільки важливі issues
8. **Use saved filters** - Створи для common searches

---

## 🆘 Common Problems

### Issue не закривається автоматично
```
Problem: PR merged but issue still open
Solution: Check if "Closes #123" in PR description or commit message
```

### Забагато issues assigned
```
Problem: > 5 issues assigned to one person
Solution: Re-prioritize, delegate, or move to backlog
```

### Stale issues (>30 days no activity)
```
Problem: Old issues cluttering backlog
Solution: Close with comment or update priority
```

### Duplicate issues
```
Problem: Same issue reported twice
Solution: Close duplicate with "Duplicate of #123"
```

---

## 📚 Resources

- [GitHub Issues Docs](https://docs.github.com/en/issues)
- [Project Organization Guide](TICKET_ORGANIZATION.md)
- [Action Plan](TICKET_ACTION_PLAN.md)
- [Project Status](PROJECT_STATUS.md)

---

**Створено:** 2025-11-22  
**Version:** 1.0  
**Для:** ExamNinja Team

