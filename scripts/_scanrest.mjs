const base = 'https://nyjaphlguwipywbiubnc.supabase.co/rest/v1/'
const key = 'sb_publishable_BeC9DfUV8_TsNky2ijr8Mw_exBoE12n'
const headers = { apikey: key, Authorization: 'Bearer ' + key, Prefer: 'count=exact' }
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  for (const table of ['products', 'test_reports', 'categories']) {
    try {
      const r = await fetch(base + table + '?select=id&limit=1', { headers, signal: ctrl.signal })
      console.log(table, '->', r.status, r.headers.get('content-range'), (await r.text()).slice(0, 120))
    } catch (e) {
      console.log(table, 'ERR', e.message)
    }
  }
} finally {
  clearTimeout(t)
  process.exit(0)
}
