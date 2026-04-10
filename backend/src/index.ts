import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';
import { eq, desc } from 'drizzle-orm';

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

      .get('/activities', async () => {
        return await db.query.activities.findMany({
          with: {
            user: true,
            client: true
          },
          orderBy: [desc(schema.activities.check_in_time)]
        });
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
