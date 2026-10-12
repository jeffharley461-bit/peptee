// Apply SQL migrations from supabase/migrations/ to your Supabase Postgres database.
//
// Usage (from project root):
//   node scripts/migrate.mjs             apply pending + changed migrations
//   node scripts/migrate.mjs --dry-run   show what would run, apply nothing
//   node scripts/migrate.mjs --force     re-apply every migration
//   node scripts/migrate.mjs --mark-applied [NNN]
//     record files as applied WITHOUT running them — use when a DB was
//     previously migrated manually. Optional 3-digit prefix marks only
//     migrations up to and including NNN (e.g. `--mark-applied 008`
//     marks 001..008, leaving later ones pending)
//   node scripts/migrate.mjs --watch     watch the migrations folder and auto-apply
//   node scripts/migrate.mjs --help      show this help
//
// Credentials come from .env in the project root (Node 20.12+, uses process.loadEnvFile):
//   SUPABASE_DB_URL=postgresql://<user>:<password>@<host>:5432/postgres
//   (DATABASE_URL is accepted as a fallback.)
//
// Tracking: applied files are recorded in the `_schema_migrations` table. Files whose
// content changed since they were applied are re-run automatically.

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, readdir, watch } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const envPath = path.join(ROOT, '.env')
if (existsSync(envPath)) {
  try { process.loadEnvFile(envPath) } catch {}
}
const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR
  ? path.resolve(ROOT, process.env.MIGRATIONS_DIR)
  : path.join(ROOT, 'supabase', 'migrations')
const TRACKING_TABLE = process.env.MIGRATIONS_TABLE || '_schema_migrations'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const FORCE = args.includes('--force')
const WATCH = args.includes('--watch')
const MARK_ARG = args.indexOf('--mark-applied')
const MARK_APPLIED = MARK_ARG >= 0
const MARK_PREFIX = (MARK_ARG >= 0 && args[MARK_ARG + 1] && !args[MARK_ARG + 1].startsWith('--'))
  ? args[MARK_ARG + 1]
  : undefined

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage:
  node scripts/migrate.mjs             apply pending + changed migrations
  node scripts/migrate.mjs --dry-run   show what would run, apply nothing
  node scripts/migrate.mjs --force     re-apply every migration
  node scripts/migrate.mjs --mark-applied [NNN]
                                       record current files as applied WITHOUT
                                       running them (for DBs already migrated
                                       manually, prevents duplicate inserts).
                                       Optional 3-digit prefix marks only up
                                       to NNN, e.g. --mark-applied 008
  node scripts/migrate.mjs --watch     watch the migrations folder and auto-apply

Credentials (.env):
  SUPABASE_DB_URL=postgresql://<user>:<password>@<host>:5432/postgres`)
  process.exit(0)
}

void main()

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
  if (!connectionString || connectionString.includes('YOUR-') || connectionString.includes('placeholder')) {
    console.error('[migrate] Missing or unset DB connection string.')
    console.error('')
    console.error('Add it to .env in the project root:')
    console.error('  SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@<host>:5432/postgres')
    console.error('  (Supabase Dashboard > Project Settings > Database > Connection string)')
    process.exit(1)
  }

  const files = await listMigrationFiles()
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect().catch(err => {
    console.error(`[migrate] Could not connect to database: ${err.message}`)
    if (connectionString.includes('db.') && /\.supabase\.co/i.test(connectionString)) {
      console.error('[migrate] Hint: the direct db.<ref>.supabase.co host is often IPv6-only and may be unreachable.')
      console.error('[migrate]   Use the IPv4 pooler connection string from:')
      console.error('[migrate]   Dashboard > Project Settings > Database > "Connection string" > URI (Session mode)')
    }
    process.exit(1)
  })

  await ensureTrackingTable(client)
  const applied = await getApplied(client)
  const plan = await buildPlan(files, applied)

  if (MARK_APPLIED) {
    const plan = await buildPlan(files, applied)
    const targets = MARK_PREFIX
      ? plan.filter(p => p.file.slice(0, 3).localeCompare(MARK_PREFIX) <= 0)
      : plan
    for (const item of targets) {
      await client.query(
        `INSERT INTO ${TRACKING_TABLE} (name, checksum, applied_at)
         VALUES ($1, $2, now())
         ON CONFLICT (name) DO UPDATE SET checksum = EXCLUDED.checksum, applied_at = now()`,
        [item.file, item.checksum]
      )
      console.log(`  MARKED  ${item.file}`)
    }
    console.log(`[migrate] Marked ${targets.length} migration file(s) as applied — no SQL executed.`)
    await client.end()
    if (!WATCH) process.exit(0)
    return
  }

  if (DRY_RUN) {
    printPlan(plan)
    await client.end()
    if (WATCH) return
    process.exit(0)
  }

  const pending = plan.filter(p => p.action !== 'skip')
  if (pending.length === 0) {
    console.log(`[migrate] Up to date — 0 migrations to apply (${plan.length} total).`)
  } else {
    console.log(`[migrate] Applying ${pending.length} migration${pending.length > 1 ? 's' : ''}...`)
    for (const item of pending) {
      const ok = await applyOne(client, item)
      if (!ok) {
        console.error('[migrate] Aborting — fix the failing migration and re-run.')
        await client.end()
        if (WATCH) return
        process.exit(1)
      }
    }
  }

  await client.end()
  if (!WATCH) process.exit(0)
}

async function listMigrationFiles() {
  if (!existsSync(MIGRATIONS_DIR)) {
    console.error(`[migrate] Migrations directory not found: ${MIGRATIONS_DIR}`)
    process.exit(1)
  }
  const entries = (await readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort()
  if (entries.length === 0) {
    console.error(`[migrate] No .sql files in ${MIGRATIONS_DIR}`)
    process.exit(1)
  }
  return entries
}

async function ensureTrackingTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${TRACKING_TABLE} (
      name       text PRIMARY KEY,
      checksum   text,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`)
}

async function getApplied(client) {
  const { rows } = await client.query(`SELECT name, checksum FROM ${TRACKING_TABLE}`)
  return new Map(rows.map(r => [r.name, r.checksum]))
}

async function buildPlan(files, applied) {
  const items = await Promise.all(files.map(async file => {
    const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8')
    const checksum = sha256(sql)
    let action = 'apply'
    const prev = applied.get(file)
    if (prev != null) {
      action = prev === checksum ? 'skip' : 'change'
      if (FORCE) action = 'force'
    }
    return { file, sql, checksum, action }
  }))
  return items.sort((a, b) => a.file.localeCompare(b.file))
}

function sha256(str) {
  return createHash('sha256').update(str).digest('hex')
}

function printPlan(plan) {
  console.log('[migrate] Dry run — pending migrations:')
  let count = 0
  for (const item of plan) {
    if (item.action === 'skip') continue
    count++
    const tag = item.action === 'change' ? 'RE-APPLY' : item.action === 'force' ? 'FORCE' : 'APPLY'
    console.log(`  ${tag.padEnd(8)} ${item.file}`)
  }
  console.log(count === 0 ? '  (nothing to apply)' : `  ${count} to apply`)
}

async function applyOne(client, item) {
  console.log(`  ${item.action === 'change' ? 'RE-APPLY' : item.action === 'force' ? 'FORCE' : 'APPLY'}  ${item.file}`)
  try {
    await client.query('BEGIN')
    await client.query(item.sql)
    await client.query(
      `INSERT INTO ${TRACKING_TABLE} (name, checksum, applied_at)
       VALUES ($1, $2, now())
       ON CONFLICT (name) DO UPDATE SET checksum = EXCLUDED.checksum, applied_at = now()`,
      [item.file, item.checksum]
    )
    await client.query('COMMIT')
    console.log(`        OK  ${item.file}`)
    return true
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error(`        FAILED  ${item.file}: ${err.message}`)
    return false
  }
}

if (WATCH) {
  console.log(`[migrate] Watching ${MIGRATIONS_DIR} for changes... (Ctrl+C to stop)`)
  let timer
  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(() => main().catch(err => console.error(`[migrate] watch error: ${err.message}`)), 400)
  }
  const w = watch(MIGRATIONS_DIR, { persistent: true })
  for await (const _evt of w) schedule()
}