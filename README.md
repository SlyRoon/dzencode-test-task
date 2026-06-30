# Inventory — SPA: Приходы (Orders) & Продукты (Products)

Тестовое задание dZENcode. SPA-приложение для учёта **приходов** (Orders) и
**продуктов** (Products): каждый приход содержит свои продукты. Реализованы
просмотр, фильтрация, создание и удаление сущностей, real-time счётчик активных
вкладок и локализация интерфейса.

## Функционал

- **Приходы (ПРИХОД / ГРУППЫ / Orders)** — список приходов; по клику приход
  раскрывается справа и показывает входящие в него продукты.
  - По каждому приходу: название, количество продуктов, дата создания в двух
    форматах, сумма прихода в двух валютах (USD/UAH).
  - **Создание прихода** — кнопка «＋» открывает форму с валидацией.
  - **Удаление прихода** — кнопка корзины открывает попап-подтверждение
    (см. ТЗ), удаление идёт на сервер (REST `DELETE`).
- **Продукты (ПРОДУКТЫ)** — список всех продуктов с **фильтром по типу**
  и по спецификации.
  - По каждому продукту: название, тип, статус, даты гарантии в разных форматах,
    цена в двух валютах, группа (спецификация), приход, дата.
  - **Добавление продукта** в приход — форма с валидацией (обязательные поля,
    положительные значения, корректный диапазон дат гарантии).
  - **Удаление продукта** — REST `DELETE`.
- **TopMenu** — дата и время в реальном времени (правый верхний угол) и счётчик
  активных вкладок/сессий через **WebSocket (socket.io)**.
- **Локализация RU/EN** (i18next) с переключателем языка в шапке; выбор языка
  сохраняется в `localStorage`.
- **Анимации** переходов между роутами и появления/закрытия модальных окон
  (framer-motion).
- Навигация (react-router), глобальное состояние (Redux Toolkit), вёрстка на
  Bootstrap, стили по методологии БЭМ.

## Навигация (левое меню)

| Пункт меню       | Маршрут      | Содержимое                                                     |
| ---------------- | ------------ | ------------------------------------------------------------- |
| **ПРИХОД**       | `/income`    | Приходы                                                       |
| **ГРУППЫ**       | `/groups`    | Приходы (split-вид: список + продукты выбранного + удаление)   |
| **ПРОДУКТЫ**     | `/products`  | Список продуктов                                              |
| **ПОЛЬЗОВАТЕЛИ** | `/users`     | Заглушка                                                      |
| **НАСТРОЙКИ**    | `/settings`  | Заглушка                                                      |

## Стек технологий (по требованиям ТЗ)

| Требование ТЗ            | Реализация                                  |
| ----------------------- | ------------------------------------------- |
| React.js (последняя)    | React 19                                    |
| Redux                   | Redux Toolkit                               |
| Роутинг                 | react-router-dom                            |
| Анимации                | framer-motion (роуты + модалки)             |
| CSS Architecture (БЭМ)  | БЭМ-нейминг классов                         |
| CSS Framework           | Bootstrap 5                                 |
| REST (Axios/Fetch)      | Axios                                       |
| Form (Validation)       | Формы добавления прихода/продукта + валидация (клиент и сервер) |
| WebSocket               | socket.io (счётчик активных вкладок)        |
| Git                     | Ветки `backend` / `frontend` / `main`       |
| Docker                  | Dockerfile (back + front) + docker-compose  |
| TypeScript (Junior+)    | Весь фронт и бэк на TypeScript              |
| i18n (Junior+)          | i18next, RU/EN                              |
| Web Storage (Junior+)   | localStorage (язык интерфейса)              |
| Файл схемы БД           | `db/schema.sql` (MySQL Workbench)           |

## Требования

- Node.js 20+ и npm
- (опционально) Docker + Docker Compose

## Запуск локально (dev)

Backend нужно запускать первым — он отдаёт данные и поднимает WebSocket-сервер,
к которому подключается frontend. Для backend нужна MariaDB и `DATABASE_URL`.

### Вариант 1: проще всего через Docker

```bash
docker compose up --build
```

После запуска:

- Frontend — http://localhost
- Backend — http://localhost:3000

### Вариант 2: локальный dev без Docker

Подними MariaDB локально и создай базу из `db/schema.sql`, либо используй
локальный контейнер только для БД:

```bash
docker compose up -d db
```

Затем запусти backend:

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:seed
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на http://localhost:5173, backend — на
http://localhost:3000.

## Запуск через Docker

```bash
docker compose up --build
```

После сборки:

- Frontend — http://localhost (отдаётся через nginx)
- Backend — http://localhost:3000

Браузер обращается к backend через nginx по `/api`; backend-порт `3000` также
публикуется наружу для прямой проверки API.

## Production-сборка фронтенда

```bash
cd frontend
npm run build      # результат -> frontend/dist
```

## API

| Метод    | Endpoint             | Описание                          |
| -------- | -------------------- | --------------------------------- |
| `GET`    | `/api/orders`        | Список приходов                   |
| `POST`   | `/api/orders`        | Создать приход (валидация)        |
| `DELETE` | `/api/orders/:id`    | Удалить приход                    |
| `GET`    | `/api/products`      | Список продуктов                  |
| `POST`   | `/api/products`      | Создать продукт (валидация)       |
| `DELETE` | `/api/products/:id`  | Удалить продукт                   |

WebSocket: событие `activeSessions` — количество активных вкладок/сессий.

## Файл схемы БД

`db/schema.sql` можно открыть и выполнить в MySQL Workbench — он создаёт базу
`inventory` и таблицы `orders`, `products`, `prices` с тестовыми записями.

## Структура проекта

```text
backend/
  src/
    server.ts            # точка входа: Express + socket.io
    app.ts               # конфигурация Express
    routes/              # /api/orders, /api/products
    controllers/         # CRUD-логика
    mockData.ts          # входные данные (по примеру app.js)
    types/
  Dockerfile
frontend/
  src/
    app/store.ts         # Redux store
    features/
      orders/            # список приходов, детали, попап удаления, форма прихода
      products/          # список продуктов, фильтры, форма добавления продукта
    layouts/
      TopMenu/           # время + счётчик вкладок + переключатель языка
      Sidebar/           # навигация
    pages/               # Orders, Products, Stub, NotFound
    components/
      LanguageSwitcher/  # RU/EN
    i18n/                # конфиг и переводы (ru.json / en.json)
    hooks/ utils/ services/ types/
  Dockerfile
  nginx.conf
db/schema.sql
docker-compose.yml
```

## Самопроверка

Проект запускается «с нуля» по этому README: установка зависимостей в `backend`
и `frontend`, затем `npm run dev` в обоих, либо `docker compose up --build`.
