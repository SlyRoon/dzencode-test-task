# Inventory — SPA: Приходы (Orders) & Продукты (Products)

## Краткое описание

SPA для учёта приходов (Orders) и продуктов (Products). Приложение
позволяет просматривать приходы вместе с входящими в них продуктами,
управлять списком продуктов и удалять приходы через подтверждающий попап.

Основные возможности:

- Список приходов с раскрытием деталей и продуктами внутри каждого прихода.
- Попап удаления прихода с подтверждением.
- Список продуктов с фильтром по типу.
- TopMenu с реальным временем и счётчиком активных вкладок через WebSocket
  (socket.io).
- Локализация RU/EN (i18next) с переключателем языка.
- Навигация на client-side (react-router).
- Управление состоянием через Redux Toolkit.
- Анимации переходов (framer-motion).
- Вёрстка на Bootstrap и стили по методологии БЭМ.

## Навигация (левое меню)

- **ПРИХОД** → список продуктов (Продукты / N).
- **ГРУППЫ** → приходы (split-вид: список приходов слева, продукты
  выбранного прихода справа, кнопка удаления → попап).
- **ПРОДУКТЫ** → список продуктов.
- **ПОЛЬЗОВАТЕЛИ / НАСТРОЙКИ** → заглушки.

## Стек технологий

**Frontend:**

- React 19 + Vite + TypeScript
- Redux Toolkit
- react-router-dom
- socket.io-client
- i18next (локализация RU/EN)
- framer-motion (анимации)
- Bootstrap

**Backend:**

- Node.js + Express + TypeScript
- socket.io (WebSocket, счётчик активных сессий)
- REST API под префиксом `/api`

## Требования

- Node.js 20+ и npm
- (Опционально) Docker + Docker Compose

## Запуск локально (dev)

Backend необходимо запускать первым — он отдаёт данные и поднимает
WebSocket-сервер, к которому подключается frontend.

Backend (http://localhost:3000):

```bash
cd backend
npm install
npm run dev
```

Frontend (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

## Запуск через Docker

```bash
docker compose up --build
```

После сборки:

- Frontend — http://localhost:5173
- Backend — http://localhost:3000

Frontend отдаётся через nginx (статическая сборка). Браузер обращается к
backend напрямую по адресу http://localhost:3000, поэтому порт backend
обязательно публикуется наружу (он опубликован в `docker-compose.yml`).

## Сборка production frontend

```bash
cd frontend
npm run build
```

Результат сборки помещается в `frontend/dist`.

## Структура проекта

```text
backend/
  src/
    server.ts        # точка входа, Express + socket.io
    routes/          # роуты /api/orders, /api/products
    mockData.ts      # тестовые данные
frontend/
  src/
    features/
      orders/        # список приходов, детали, попап удаления
      products/      # список продуктов с фильтром
    layouts/
      TopMenu/       # верхнее меню: время + активные вкладки
    pages/           # страницы (Orders, Products, NotFound)
    hooks/           # типизированные redux-хуки
    utils/           # вспомогательные функции (formatDate и т.д.)
```

## Файл схемы БД

Схема базы данных находится в `db/schema.sql`. Файл можно открыть в
MySQL Workbench и выполнить — он создаёт базу `inventory`, таблицы
`orders`, `products`, `prices` и добавляет тестовые записи.

## API endpoints

- `GET /api/orders` — список приходов.
- `DELETE /api/orders/:id` — удаление прихода.
- `GET /api/products` — список продуктов.

WebSocket:

- Событие `activeSessions` — текущее количество активных вкладок/сессий.
