<<<<<<< HEAD
import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';
import { eq, and, sql, or } from 'drizzle-orm';
import ExcelJS from 'exceljs';

const PORT = 3000;
const DB_URL = process.env.DATABASE_URL || 'mysql://admin:password@localhost:3307/sfas';

// DB Connection
const connection = await mysql.createConnection(DB_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({ assets: 'public', prefix: '/public' }))
  .get('/', () => ({ status: 'SFAS API is running' }))

  // --- Common Routes ---
  .get('/partners', async () => await db.query.partners.findMany())
  .get('/offices', async () => await db.query.offices.findMany())
  .get('/sales-users', async () => await db.query.users.findMany({ where: eq(schema.users.role, 'sales') }))

  // --- Supervision Module ---
  .group('/supervision', (app) =>
    app
      .get('/pensioners', async ({ query }) => {
        const { partnerId, officeId, status, search } = query;
        const filters = [];
        if (partnerId) filters.push(eq(schema.pensioners.partnerId, Number(partnerId)));
        if (officeId) filters.push(eq(schema.pensioners.officeId, Number(officeId)));
        if (status) filters.push(eq(schema.pensioners.status, status));
        
        let whereClause = filters.length > 0 ? and(...filters) : undefined;
        if (search) {
          const searchFilter = or(sql`${schema.pensioners.name} LIKE ${'%' + search + '%'}`);
          whereClause = whereClause ? and(whereClause, searchFilter) : searchFilter;
        }

        return await db.query.pensioners.findMany({
          where: whereClause,
          with: {
            partner: true,
            office: true,
          }
        });
      })
      .post('/reassign', async ({ body }) => {
        const { ids, picSalesId } = body;
        return await db.update(schema.pensioners)
          .set({ picSalesId, status: 'Allocated' })
          .where(sql`${schema.pensioners.id} IN (${sql.join(ids)})`);
      }, {
        body: t.Object({
          ids: t.Array(t.Number()),
          picSalesId: t.Number()
        })
      })
  )

  // --- Sales Module ---
  .group('/sales', (app) =>
    app
      .get('/my-leads', async ({ query }) => {
        const { salesId } = query;
        if (!salesId) return [];
        return await db.query.pensioners.findMany({
          where: eq(schema.pensioners.picSalesId, Number(salesId)),
          with: {
            partner: true,
            office: true
          }
        });
      })
      .post('/log-activity', async ({ body }) => {
        const { pensionerId, salesId, description, latitude, longitude, photoUrl } = body;
        
        // Transaction to add activity and update lead status
        return await db.transaction(async (tx) => {
          await tx.insert(schema.salesActivities).values({
            pensionerId,
            salesId,
            description,
            latitude: latitude ? String(latitude) : null,
            longitude: longitude ? String(longitude) : null,
            photoUrl,
          });
          
          await tx.update(schema.pensioners)
            .set({ status: 'Visited', lastActivityAt: new Date() })
            .where(eq(schema.pensioners.id, pensionerId));
            
          return { success: true };
        });
      }, {
        body: t.Object({
          pensionerId: t.Number(),
          salesId: t.Number(),
          description: t.String(),
          latitude: t.Optional(t.Number()),
          longitude: t.Optional(t.Number()),
          photoUrl: t.Optional(t.String())
        })
      })
      .get('/activities', async ({ query }) => {
        const { salesId, startDate, endDate } = query;
        const filters = [];
        if (salesId) filters.push(eq(schema.salesActivities.salesId, Number(salesId)));
        
        return await db.query.salesActivities.findMany({
          where: filters.length > 0 ? and(...filters) : undefined,
          with: {
            pensioner: true
          },
          orderBy: (activities, { desc }) => [desc(activities.visitedAt)]
        });
      })
      .delete('/activity/:id', async ({ params }) => {
        return await db.delete(schema.salesActivities).where(eq(schema.salesActivities.id, Number(params.id)));
      })
      .get('/export/excel', async ({ query, set }) => {
        const { salesId } = query;
        const activities = await db.query.salesActivities.findMany({
          where: salesId ? eq(schema.salesActivities.salesId, Number(salesId)) : undefined,
          with: { pensioner: true, sales: true }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Activities');
        worksheet.columns = [
          { header: 'Date', key: 'date', width: 20 },
          { header: 'Sales Name', key: 'sales', width: 20 },
          { header: 'Pensioner Name', key: 'pensioner', width: 25 },
          { header: 'Description', key: 'description', width: 40 },
          { header: 'Latitude', key: 'lat', width: 15 },
          { header: 'Longitude', key: 'lng', width: 15 },
        ];

        activities.forEach(a => {
          worksheet.addRow({
            date: a.visitedAt.toLocaleString(),
            sales: a.sales.name,
            pensioner: a.pensioner.name,
            description: a.description,
            lat: a.latitude,
            lng: a.longitude
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        set.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        set.headers['Content-Disposition'] = `attachment; filename=SFAS_Activities_${new Date().getTime()}.xlsx`;
        
        return buffer;
      })
  )

  .listen({ port: PORT, hostname: '0.0.0.0' });

console.log(`SFAS API is running at http://localhost:${PORT}`);
=======
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const PORT = 3000;

const app = new Elysia()
  .use(cors({
    origin: true // Mengizinkan semua origin selama fase development
  }))
  .get('/', () => 'API Server Ready!')
  .listen(PORT);

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);
>>>>>>> e8a02607 (feat: implement requirements from Issue #3)
