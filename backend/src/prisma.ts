import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { getMariaDbConfig } from './databaseConfig';

const adapter = new PrismaMariaDb(getMariaDbConfig());

export const prisma = new PrismaClient({ adapter });
