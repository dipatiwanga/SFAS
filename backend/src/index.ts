import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';
import { eq, desc, and, gte, lte, like, or } from 'drizzle-orm';

const PORT = 3000;
const DB_URL = process.env.DATABASE_URL || 'mysql://admin:password@localhost:3307/sfas';

// DB Connection
const connection = await mysql.createConnection(DB_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'sfas_super_secret_key'
    })
  )
  .derive(async ({ jwt, headers: { authorization } }) => {
    if (!authorization?.startsWith('Bearer ')) {
      return { user: null };
    }
    const token = authorization.slice(7);
    const payload = await jwt.verify(token);
    return { user: payload };
  })
  .get('/', () => 'SFAS API is running')

  // --- Auth ---
  .post('/auth/login', async ({ body, jwt, set }) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, body.email)
    });

    if (!user || !(await Bun.password.verify(body.password, user.password))) {
      set.status = 401;
      return { message: 'Invalid email or password' };
    }

    const token = await jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })

  // --- Protected Routes ---
  .group('/api', (app) => 
    app
      .onBeforeHandle(({ user, set }) => {
        if (!user) {
          set.status = 401;
          return { message: 'Unauthorized' };
        }
      })
      
      // --- Admin Only Routes ---
      .get('/users', async ({ user, set }) => {
        if (user.role !== 'admin') {
          set.status = 403;
          return { message: 'Forbidden: Admin access required' };
        }
        return await db.query.users.findMany();
      })

      // --- Authenticated Routes ---
      .get('/clients', async () => await db.query.clients.findMany())

      .get('/partners', () => [
        { id: 1, name: 'Bank Mandiri' },
        { id: 2, name: 'Bank BNI' },
        { id: 3, name: 'Bank BRI' }
      ])

      .get('/offices', () => [
        { id: 1, name: 'KC Jakarta' },
        { id: 2, name: 'KC Bandung' },
        { id: 3, name: 'KC Surabaya' }
      ])

      .get('/supervision/pensioners', async () => {
        const clients = await db.query.clients.findMany();
        return clients.map(c => ({
          id: c.id,
          name: c.shop_name,
          partner: { name: 'Bank Mandiri' },
          office: { name: 'KC Jakarta' },
          status: 'Prospect',
          picSales: null
        }));
      })

      .post('/supervision/reassign', ({ body }) => {
        return { success: true, message: 'Leads reassigned successfully' };
      }, {
        body: t.Object({
          ids: t.Array(t.Number()),
          picSalesId: t.Number()
        })
      })

      .get('/activities', async ({ query }) => {
        const { user_id, start_date, end_date, mitra, search } = query;
        
        const filters = [];

        if (user_id) {
          filters.push(eq(schema.activities.user_id, Number(user_id)));
        }
        
        if (start_date) {
          filters.push(gte(schema.activities.check_in_time, new Date(`${start_date}T00:00:00Z`)));
        }
        
        if (end_date) {
          filters.push(lte(schema.activities.check_in_time, new Date(`${end_date}T23:59:59Z`)));
        }

        if (mitra) {
          filters.push(eq(schema.clients.mitra, mitra));
        }

        if (search) {
          filters.push(
            or(
              like(schema.clients.shop_name, `%${search}%`),
              like(schema.activities.notes, `%${search}%`)
            )
          );
        }

        // Using select for complex joins and direct filtering on related tables
        return await db.select({
          id: schema.activities.id,
          user_id: schema.activities.user_id,
          client_id: schema.activities.client_id,
          check_in_time: schema.activities.check_in_time,
          lat: schema.activities.lat,
          long: schema.activities.long,
          image_url: schema.activities.image_url,
          notes: schema.activities.notes,
          user: {
            id: schema.users.id,
            name: schema.users.name,
            role: schema.users.role
          },
          client: {
            id: schema.clients.id,
            shop_name: schema.clients.shop_name,
            address: schema.clients.address,
            contact: schema.clients.contact,
            mitra: schema.clients.mitra
          }
        })
        .from(schema.activities)
        .leftJoin(schema.users, eq(schema.activities.user_id, schema.users.id))
        .leftJoin(schema.clients, eq(schema.activities.client_id, schema.clients.id))
        .where(and(...filters))
        .orderBy(desc(schema.activities.check_in_time));
      }, {
        query: t.Object({
          user_id: t.Optional(t.String()),
          start_date: t.Optional(t.String()),
          end_date: t.Optional(t.String()),
          mitra: t.Optional(t.String()),
          search: t.Optional(t.String())
        })
      })

      .post('/activities', async ({ body, set }) => {
        try {
          await db.insert(schema.activities).values({
            user_id: body.userId,
            client_id: body.clientId,
            lat: body.lat?.toString(),
            long: body.long?.toString(),
            image_url: body.imageUrl,
            notes: body.notes,
          });
          return { success: true, message: 'Activity logged successfully' };
        } catch (err) {
          set.status = 500;
          return { success: false, error: (err as Error).message };
        }
      }, {
        body: t.Object({
          userId: t.Number(),
          clientId: t.Number(),
          lat: t.Optional(t.Number()),
          long: t.Optional(t.Number()),
          imageUrl: t.Optional(t.String()),
          notes: t.Optional(t.String())
        })
      })
  )

  .listen({ port: PORT, hostname: '0.0.0.0' });

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);
