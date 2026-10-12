const base = 'https://nyjaphlguwipywbiubnc.supabase.co/rest/v1/'
const key = 'sb_publishable_BeC9DfUV8_TsNky2ijr8Mw_exBoE12n'
const headers = { apikey: key, Authorization: 'Bearer ' + key }
const tests = [
  ['products?select=*,categories(id,name)&limit=1', 'embed + limit'],
  ['products?select=*,categories(id,name)&order=created_at.desc&limit=2', 'embed + order (homepage)'],
  ['test_reports?select=*&is_published=eq.true&limit=1', 'test_reports published'],
]
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  for (const [q, label] of tests) {
    try {
      const r = await fetch(base + q, { headers, signal: ctrl.signal })
      const body = await r.text()
      console.log(`[${label}] ${r.status} :: ${body.slice(0, 200)}`)
    } catch (e) {
      console.log(`[${label}] ERR ${e.message}`)
    }
  }
} finally { clearTimeout(t); process.exit(0) }
