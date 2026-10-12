// Installs the post-merge git hook so migrations auto-apply after every pull/merge.
// Run from the project root:  node scripts/setup-hooks.mjs

import { constants } from 'node:fs'
import { chmodSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const HOOKS_DIR = path.join(ROOT, '.git', 'hooks')
const SOURCE = path.join(ROOT, 'scripts', 'git-hooks', 'post-merge')
const TARGET = path.join(HOOKS_DIR, 'post-merge')

if (!existsSync(SOURCE)) {
  console.error(`[setup-hooks] Source hook not found: ${SOURCE}`)
  process.exit(1)
}

mkdirSync(HOOKS_DIR, { recursive: true })
copyFileSync(SOURCE, TARGET)
chmodSync(TARGET, 0o755)
console.log(`[setup-hooks] Installed post-merge hook → ${TARGET}`)
console.log('[setup-hooks] Migrations will auto-apply after every git pull/merge.')