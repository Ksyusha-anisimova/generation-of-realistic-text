# ЛР9N: TextGen AI — дизайн решения

## Контекст

Нужен новый проект с нуля в отдельной папке `lab7N`, с тем же уровнем автоматизации, что в прошлой лабораторной: unit-тесты, BDD-интеграция, CI/CD pipeline и отчётные артефакты.

## Архитектура

- Backend: Node.js + Express
- Frontend: статический HTML/CSS/JS
- Хранилище: in-memory users/sessions
- Роли: `user`, `admin`

## Функции

- Регистрация и вход
- Просмотр статуса текущего пользователя
- Генерация текста через AI-модули (`creative`, `formal`, `dialog`)
- Смена роли пользователю в админ-панели

## API

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/admin/users`
- `POST /api/admin/role`
- `POST /api/text`

## Тестирование

- Unit: модуль `generateRealisticText()` в `tdd/textGenerator.test.js`
- BDD: сценарии входа, регистрации, смены роли, генерации текста
- Инструменты: Node test runner, Cucumber, Playwright

## CI/CD

- Workflow `CI` с jobs: `test` -> `integration` -> `report`
- Артефакты:
  - `test-stage-artifacts`
  - `integration-stage-artifacts`
  - `ci-consolidated-artifacts`
- Workflow `CodeQL` для `analyze`

## Критерии готовности

1. Локально проходит `npm run ci:test`.
2. В GitHub Actions видны jobs `test`, `integration`, `report`, `analyze`.
3. В `report` есть список артефактов в Job Summary.
