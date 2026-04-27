# LR9N RUN GUIDE

## 1. Локальный запуск

```bash
npm install
npm start
```

## 2. Локальные проверки

```bash
npm run ci:test
npm run ci:integration
```

## 3. GitHub Actions

Workflow `CI`:
- `test` — lint + complexity + unit coverage
- `integration` — BDD сценарии (Cucumber + Playwright)
- `report` — сводка и артефакты

Workflow `CodeQL`:
- `analyze` — статический security-анализ
