const base = 'https://nyjaphlguwipywbiubnc.supabase.co/rest/v1/'
const key = 'sb_publishable_BeC9DfUV8_TsNky2ijr8Mw_exBoE12n'
const headers = { apikey: key, Authorization: 'Bearer ' + key }
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 20000)
try {
  const r = await fetch(base + 'test_reports?select=id&limit=1&is_published=eq.true', { headers, signal: ctrl.signal })
  const body = await r.text()
  console.log(r.status, body.slice(0, 60))
} finally { clearTimeout(t); process.exit(0) }
