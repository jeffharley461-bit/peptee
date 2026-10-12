import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const envPath = path.join(ROOT, '.env')
if (existsSync(envPath)) { try { process.loadEnvFile(envPath) } catch {} }

const cs = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } })
await client.connect()
for (const t of ['products', 'test_reports', 'categories', '_schema_migrations']) {
  try {
    const { rows } = await client.query(`SELECT count(*)::int AS n FROM ${t}`)
    console.log(t, '=', rows[0].n)
  } catch (e) { console.log(t, 'ERR', e.message) }
}
const { rows: cats } = await client.query(`SELECT c.name, count(p.id)::int AS n FROM categories c LEFT JOIN products p ON p.category_id=c.id GROUP BY c.name ORDER BY c.name`)
console.log('categories:', JSON.stringify(cats))
const { rows: pv } = await client.query(`SELECT name, purity_percent, price_usd, category_id FROM products ORDER BY name LIMIT 60`)
console.log('products:', JSON.stringify(pv, null, 0))
await client.end()
