# Orders & Products SPA

SPA-приложение для учета приходов и продуктов по тестовому заданию `JavaScript / ReactJS`.

Production: https://skyroon2.2skyroon.online/

## Функции

- Страницы с роутингом: `ПРИХОД`, `ГРУППЫ`, `ПРОДУКТЫ`, `ПОЛЬЗОВАТЕЛИ`, `НАСТРОЙКИ`.
- `ПРИХОД`: список приходов, количество продуктов, даты в двух форматах, суммы в USD/UAH, удаление через modal.
- `ГРУППЫ`: split-view с выбранным приходом и продуктами справа.
- `ПРОДУКТЫ`: общий список продуктов с фильтрами по типу и спецификации.
- Добавление приходов и продуктов с валидацией формы.
- Удаление продуктов и приходов.
- TopMenu с текущей датой/временем в реальном времени.
- Socket.IO счетчик активных вкладок/сессий приложения.
- i18n: RU/EN переключатель.
- Анимации переходов между роутами и компонентами.

## Стек

- React 19, TypeScript, Vite
- Redux Toolkit, React Redux
- React Router
- Bootstrap, CSS modules by component
- Framer Motion
- Axios REST client
- Express, Socket.IO
- Prisma, MariaDB
- Docker / Docker Compose

## Структура

```text
frontend/              React SPA
backend/               Express REST API + Socket.IO
backend/prisma/        Prisma schema and seed
db/schema.sql          MySQL/MariaDB schema for MySQL Workbench
docker-compose.yml     Full local/prod container stack
```

## Быстрый запуск через Docker

Требования:

- Docker
- Docker Compose plugin

Запуск:

```bash
docker compose up -d --build
```

Приложение:

```text
http://localhost/
```

API:

```text
http://localhost/api/orders
http://localhost/api/products
```

Если база уже существовала и данные были удалены, заполнить ее заново:

```bash
docker compose exec backend npm run prisma:seed
```

Остановить проект:

```bash
docker compose down
```

Полностью удалить контейнеры и volume базы:

```bash
docker compose down -v
```

## Запуск для разработки

Требования:

- Node.js 20+
- npm
- Docker для MariaDB

Установить зависимости:

```bash
cd backend
npm ci

cd ../frontend
npm ci
```

Поднять MariaDB:

```bash
cd ..
docker compose up -d db
```

Backend использует `DATABASE_URL`. Для локального запуска:

```bash
cd backend
export DATABASE_URL="mysql://db_user:password123@localhost:3306/inventory"
npm run prisma:generate
npm run prisma:seed
npm run dev
```

В отдельном терминале запустить frontend:

```bash
cd frontend
npm run dev
```

Открыть:

```text
http://localhost:5173/
```

Vite проксирует `/api` и `/api/socket.io` на backend `http://localhost:3000`.

## Скрипты

Backend:

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:seed
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## База данных

Файл схемы БД для проверки в MySQL Workbench:

```text
db/schema.sql
```

Prisma schema:

```text
backend/prisma/schema.prisma
```

Seed-данные:

```text
backend/prisma/seed.js
```

Seed создает тестовые приходы, продукты и цены в двух валютах.

## API

```text
GET    /api/orders
POST   /api/orders
DELETE /api/orders/:id

GET    /api/products
POST   /api/products
DELETE /api/products/:id
```

## WebSocket

Socket.IO работает по пути:

```text
/api/socket.io
```

Backend увеличивает счетчик при подключении вкладки и уменьшает при отключении. TopMenu показывает текущее количество активных socket-сессий в реальном времени.

## Production deploy

Деплой настроен через GitHub Actions:

```text
.github/workflows/deploy-vps.yml
```

Пуш в ветку `prod` собирает Docker-контейнеры на VPS, запускает seed базы и обновляет приложение.

## Самопроверка

Перед сдачей:

```bash
docker compose down -v
docker compose up -d --build
curl http://localhost/api/orders
curl http://localhost/api/products
```

Ожидаемый результат: API возвращает заполненные массивы приходов и продуктов, frontend открывается без пустого состояния.
