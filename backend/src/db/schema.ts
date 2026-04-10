import { mysqlTable, serial, varchar, text, timestamp, decimal, mysqlEnum, bigint } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['sales', 'admin']).notNull(),
});

export const clients = mysqlTable('clients', {
  id: serial('id').primaryKey(),
  shop_name: varchar('shop_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  contact: varchar('contact', { length: 50 }).notNull(),
});

export const activities = mysqlTable('activities', {
  id: serial('id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id).notNull(),
  client_id: bigint('client_id', { mode: 'number', unsigned: true }).references(() => clients.id).notNull(),
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
}));
