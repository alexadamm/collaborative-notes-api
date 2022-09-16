const { PrismaClient } = require('@prisma/client');

const pool = new PrismaClient();

module.exports = pool;
