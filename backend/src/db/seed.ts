import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const DB_URL = process.env.DATABASE_URL || 'mysql://admin:password@localhost:3307/sfas';

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  const db = drizzle(connection);

  console.log('Seeding database with new model...');

  // 1. Seed Users
  await db.insert(schema.users).values([
    { name: 'Admin User', email: 'admin@sfas.com', password: await Bun.password.hash('password123'), role: 'admin' },
    { name: 'Sales Joni', email: 'joni@sfas.com', password: await Bun.password.hash('password123'), role: 'sales' },
    { name: 'Sales Susi', email: 'susi@sfas.com', password: await Bun.password.hash('password123'), role: 'sales' },
  ]);

  // 2. Seed Clients (Shops)
  await db.insert(schema.clients).values([
    { shop_name: 'Toko Kelontong Berkah', address: 'Jl. Merdeka No. 10', contact: '08123456789' },
    { shop_name: 'Warung Makan Enak', address: 'Jl. Mawar No. 5', contact: '08122223333' },
    { shop_name: 'Minimarket Sejahtera', address: 'Jl. Melati No. 20', contact: '08199998888' },
  ]);

  console.log('Seeding completed!');
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
