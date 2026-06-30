require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const getMariaDbConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
  };
};

const adapter = new PrismaMariaDb(getMariaDbConfig());
const prisma = new PrismaClient({ adapter });

const orders = [
  {
    id: 1,
    title: 'Длинное предлинное длиннючее название прихода',
    date: '2017-09-06 12:09:33',
    description: 'Партия мониторов для главного офиса',
  },
  {
    id: 2,
    title: 'Приход серверного оборудования и рабочих станций',
    date: '2017-09-12 10:15:00',
    description: 'Техника для инфраструктурного отдела',
  },
  {
    id: 3,
    title: 'Поставка периферии и сетевого оборудования',
    date: '2017-10-03 15:45:10',
    description: 'Клавиатуры, мыши, роутеры и коммутаторы',
  },
  {
    id: 4,
    title: 'Тестовый приход техники для отдела продаж',
    date: '2017-11-18 09:30:25',
    description: 'Ноутбуки и презентационные дисплеи',
  },
];

const productTitles = [
  'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
  'Dell UltraSharp U2412M 24-inch IPS Monitor',
  'Apple Thunderbolt Display 27-inch A1407',
  'Lenovo ThinkPad T480 Corporate Edition',
  'HP ProDesk 600 G4 Small Form Factor',
  'Cisco Catalyst 2960-X 24 Port Switch',
  'Logitech MX Keys Advanced Wireless Keyboard',
  'Samsung Odyssey G5 Curved Gaming Monitor',
  'ASUS ProArt Display PA278QV Calibrated Monitor',
  'Intel NUC 11 Performance Mini PC',
];

const productTypes = ['Monitors', 'Laptops', 'Desktops', 'Network', 'Accessories'];
const specifications = [
  'Длинное предлинное длиннючее название группы',
  'Рабочие места бухгалтерии',
  'Христорождественский Александр',
  'Складской резерв и замена',
  'Техника переговорных комнат',
];

const products = Array.from({ length: 25 }, (_, index) => {
  const id = index + 1;
  const usd = 110 + index * 35;
  const order = (index % orders.length) + 1;

  return {
    id,
    serialNumber: 123456789 + index,
    isNew: index % 3 === 1 ? 0 : 1,
    photo: 'pathToFile.jpg',
    title: productTitles[index % productTitles.length],
    type: productTypes[index % productTypes.length],
    specification: specifications[index % specifications.length],
    guarantee: {
      start: '2017-04-06 12:00:00',
      end: '2025-08-06 12:00:00',
    },
    price: [
      { value: usd, symbol: 'USD', isDefault: 0 },
      { value: usd * 26, symbol: 'UAH', isDefault: 1 },
    ],
    order,
    date: orders[order - 1].date,
  };
});

const toDate = (value) => new Date(value.replace(' ', 'T'));

async function main() {
  await prisma.price.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();

  for (const order of orders) {
    await prisma.order.create({
      data: {
        id: order.id,
        title: order.title,
        date: toDate(order.date),
        description: order.description,
      },
    });
  }

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        serialNumber: String(product.serialNumber),
        isNew: product.isNew,
        photo: product.photo,
        title: product.title,
        type: product.type,
        specification: product.specification,
        guaranteeStart: toDate(product.guarantee.start),
        guaranteeEnd: toDate(product.guarantee.end),
        orderId: product.order,
        date: toDate(product.date),
        prices: {
          create: product.price.map((price) => ({
            value: price.value,
            symbol: price.symbol,
            isDefault: price.isDefault,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
