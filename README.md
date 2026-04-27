# TextGen AI (Lab7N)

Веб-приложение для генерации реалистичного текста с помощью модулей искусственного интеллекта.

## Функциональность

- Регистрация и вход пользователей
- Сеансовая авторизация через cookie
- Генерация текста через AI-модули: `creative`, `formal`, `dialog`
- Админ-панель для изменения ролей пользователей

## API

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/admin/users`
- `POST /api/admin/role`
- `POST /api/text`

## Запуск

```bash
npm install
npm start
```

Открыть: `http://localhost:3000`

## Тесты

```bash
npm run ci:test
npm run ci:integration
```
