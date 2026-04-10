import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const DB_URL = process.env.DATABASE_URL || 'mysql://admin:password@localhost:3307/sfas';

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  const db = drizzle(connection);

  console.log('Seeding database...');

  // 1. Seed Partners
  await db.insert(schema.partners).values([
    { name: 'DAPENBUN', category: 'Dapen' },
    { name: 'DP4', category: 'Dapen' },
    { name: 'PERTAMINA', category: 'Dapen' },
  ]);

  // 2. Seed Offices
  await db.insert(schema.offices).values([
    { name: 'KC Jakarta Pusat', location: 'Jakarta' },
    { name: 'KC Surabaya', location: 'Surabaya' },
    { name: 'KC Bandung', location: 'Bandung' },
  ]);

  // 3. Seed Users (Supervisior & Sales)
  await db.insert(schema.users).values([
    { name: 'Budi Supervisor', email: 'budi@sfas.com', role: 'supervisor' },
    { name: 'Ani Sales', email: 'ani@sfas.com', role: 'sales' },
    { name: 'Iwan Sales', email: 'iwan@sfas.com', role: 'sales' },
  ]);

  // 4. Seed Pensioners (Leads)
  await db.insert(schema.pensioners).values([
    { name: 'Slamet Riyadi', partnerId: 1, officeId: 1, status: 'Prospect' },
    { name: 'Siti Aminah', partnerId: 1, officeId: 1, status: 'Prospect' },
    { name: 'Joko Widodo', partnerId: 2, officeId: 2, status: 'Prospect' },
    { name: 'Kartini', partnerId: 3, officeId: 3, status: 'Prospect' },
  ]);

  console.log('Seeding completed!');
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
