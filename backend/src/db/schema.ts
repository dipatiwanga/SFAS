<<<<<<< HEAD
import { mysqlTable, serial, varchar, text, timestamp, int, decimal, boolean, bigint } from 'drizzle-orm/mysql-core';
=======
import { mysqlTable, serial, text, int, timestamp, decimal, mysqlEnum } from 'drizzle-orm/mysql-core';
>>>>>>> e8a02607 (feat: implement requirements from Issue #3)
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
<<<<<<< HEAD
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
=======
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: mysqlEnum('role', ['sales', 'admin']).notNull(),
});

export const clients = mysqlTable('clients', {
  id: serial('id').primaryKey(),
  shop_name: text('shop_name').notNull(),
  address: text('address').notNull(),
  contact: text('contact').notNull(),
});

export const activities = mysqlTable('activities', {
  id: serial('id').primaryKey(),
  user_id: int('user_id').references(() => users.id).notNull(),
  client_id: int('client_id').references(() => clients.id).notNull(),
  check_in_time: timestamp('check_in_time').defaultNow().notNull(),
  lat: decimal('lat', { precision: 10, scale: 8 }),
  long: decimal('long', { precision: 11, scale: 8 }),
  image_url: text('image_url'),
  notes: text('notes'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.user_id],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [activities.client_id],
    references: [clients.id],
  }),
>>>>>>> e8a02607 (feat: implement requirements from Issue #3)
}));
