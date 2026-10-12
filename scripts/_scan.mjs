import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, '..', 'dist', 'assets')
const files = (await readdir(dir)).filter(f => f.endsWith('.js'))
for (const f of files) {
  const txt = await readFile(path.join(dir, f), 'utf8')
  const hits = new Set()
  for (const re of [/new URL\([^)]*\)/g]) void re
  for (const needle of ['placeholder.supabase.co', 'nyjaphlguwipywbiubnc.supabase.co']) {
    if (txt.includes(needle)) hits.add(needle)
  }
  const urlMatches = txt.match(/https:\/\/[a-z0-9]+\.supabase\.co/g)
  if (urlMatches) urlMatches.forEach(u => hits.add(u))
  if (hits.size) console.log(f, '=>', [...hits].join(', '))
}
