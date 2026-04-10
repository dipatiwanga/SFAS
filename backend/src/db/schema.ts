import { mysqlTable, serial, varchar, text, timestamp, int, decimal, boolean, bigint } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull(), // 'supervisior', 'sales'
  createdAt: timestamp('created_at').defaultNow(),
});

export const partners = mysqlTable('partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // 'Dapen', 'DP4', 'PERTAMINA', etc.
  category: varchar('category', { length: 100 }), 
});

export const offices = mysqlTable('offices', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: text('location'),
});

export const pensioners = mysqlTable('pensioners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  partnerId: bigint('partner_id', { mode: 'number', unsigned: true }).references(() => partners.id),
  officeId: bigint('office_id', { mode: 'number', unsigned: true }).references(() => offices.id),
  picSalesId: bigint('pic_sales_id', { mode: 'number', unsigned: true }).references(() => users.id),
  status: varchar('status', { length: 100 }), // 'Prospect', 'Allocated', 'Visited', 'Closed'
  lastActivityAt: timestamp('last_activity_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const salesActivities = mysqlTable('sales_activities', {
  id: serial('id').primaryKey(),
  pensionerId: bigint('pensioner_id', { mode: 'number', unsigned: true }).notNull().references(() => pensioners.id),
  salesId: bigint('sales_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id),
  description: text('description'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  photoUrl: varchar('photo_url', { length: 500 }),
  visitedAt: timestamp('visited_at').defaultNow(),
});

// Relations
export const pensionersRelations = relations(pensioners, ({ one, many }) => ({
  partner: one(partners, { fields: [pensioners.partnerId], references: [partners.id] }),
  office: one(offices, { fields: [pensioners.officeId], references: [offices.id] }),
  picSales: one(users, { fields: [pensioners.picSalesId], references: [users.id] }),
  activities: many(salesActivities),
}));

export const salesActivitiesRelations = relations(salesActivities, ({ one }) => ({
  pensioner: one(pensioners, { fields: [salesActivities.pensionerId], references: [pensioners.id] }),
  sales: one(users, { fields: [salesActivities.salesId], references: [users.id] }),
}));

export const partnersRelations = relations(partners, ({ many }) => ({
  pensioners: many(pensioners),
}));

export const officesRelations = relations(offices, ({ many }) => ({
  pensioners: many(pensioners),
}));

export const usersRelations = relations(users, ({ many }) => ({
  pensioners: many(pensioners),
  activities: many(salesActivities),
}));
