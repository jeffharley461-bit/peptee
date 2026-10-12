import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
if (existsSync(path.join(ROOT, '.env'))) { try { process.loadEnvFile(path.join(ROOT, '.env')) } catch {} }
const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } })
await client.connect()
const { rows: tables } = await client.query(`
  SELECT c.relname AS table,
         c.relrowsecurity AS rls,
         has_table_privilege('anon', c.oid, 'SELECT') AS anon_select,
         has_table_privilege('authenticated', c.oid, 'SELECT') AS auth_select
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
  ORDER BY c.relname`)
console.log(JSON.stringify(tables, null, 1))
await client.end()
process.exit(0)
