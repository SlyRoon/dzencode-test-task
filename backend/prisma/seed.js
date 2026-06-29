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
  { id: 1, title: 'Order 1', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 2, title: 'Order 2', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 3, title: 'Order 3', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 4, title: 'Order 4', date: '2017-06-29 12:09:33', description: 'desc' },
];

const products = [
  {
    id: 1,
    serialNumber: 1234,
    isNew: 1,
    photo: 'pathToFile.jpg',
    title: 'Product 1',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-06-29 12:09:33', end: '2017-06-29 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2600, symbol: 'UAH', isDefault: 1 },
    ],
    order: 1,
    date: '2017-06-29 12:09:33',
  },
  {
    id: 2,
    serialNumber: 1234,
    isNew: 1,
    photo: 'pathToFile.jpg',
    title: 'Product 2',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-06-29 12:09:33', end: '2017-06-29 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2600, symbol: 'UAH', isDefault: 1 },
    ],
    order: 2,
    date: '2017-06-29 12:09:33',
  },
];

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
