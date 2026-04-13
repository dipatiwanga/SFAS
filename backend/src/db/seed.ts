import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const DB_URL = process.env.DATABASE_URL || 'mysql://admin:password@localhost:3307/sfas';

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  const db = drizzle(connection);

  console.log('Cleeding database with new model...');

  // 0. Clear existing data
  await db.delete(schema.activities);
  await db.delete(schema.clients);
  await db.delete(schema.users);

  // 1. Seed Users
  await db.insert(schema.users).values([
    { name: 'Admin User', email: 'admin@sfas.com', password: await Bun.password.hash('password123'), role: 'admin' },
    { name: 'Sales Joni', email: 'joni@sfas.com', password: await Bun.password.hash('password123'), role: 'sales' },
    { name: 'Sales Susi', email: 'susi@sfas.com', password: await Bun.password.hash('password123'), role: 'sales' },
  ]);

  // 2. Seed Clients (Shops)
  await db.insert(schema.clients).values([
    { shop_name: 'Toko Kelontong Berkah', address: 'Jl. Merdeka No. 10', contact: '08123456789', mitra: 'DAPENBUN' },
    { shop_name: 'Warung Makan Enak', address: 'Jl. Mawar No. 5', contact: '08122223333', mitra: 'TASPEN' },
    { shop_name: 'Minimarket Sejahtera', address: 'Jl. Melati No. 20', contact: '08199998888', mitra: 'BANK' },
  ]);

  // 3. Seed Activities
  const allUsers = await db.select().from(schema.users);
  const allClients = await db.select().from(schema.clients);
  const joni = allUsers.find(u => u.name === 'Sales Joni');
  const sust = allUsers.find(u => u.name === 'Sales Susi');
  const berkah = allClients.find(c => c.shop_name === 'Toko Kelontong Berkah');
  const warung = allClients.find(c => c.shop_name === 'Warung Makan Enak');

  if (joni && berkah) {
    await db.insert(schema.activities).values([
      { user_id: joni.id, client_id: berkah.id, notes: 'Follow up visit 1', check_in_time: new Date('2026-04-10T10:00:00Z') },
      { user_id: joni.id, client_id: berkah.id, notes: 'Follow up visit 2', check_in_time: new Date('2026-04-10T11:00:00Z') },
    ]);
  }

  if (sust && warung) {
    await db.insert(schema.activities).values([
      { user_id: sust.id, client_id: warung.id, notes: 'Initial visit', check_in_time: new Date('2026-04-10T09:00:00Z') },
    ]);
  }

  console.log('Seeding completed!');
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
