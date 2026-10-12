const url = process.argv[2]
const base = 'https://nyjaphlguwipywbiubnc.supabase.co/rest/v1/'
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  const r = await fetch(url, { signal: ctrl.signal })
  const txt = await r.text()
  const jwt = (txt.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) || [])[0]
  if (!jwt) { console.log('no jwt found'); process.exit(0) }
  const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'))
  console.log('jwt payload:', JSON.stringify(payload))
  const headers = { apikey: jwt, Authorization: 'Bearer ' + jwt, Prefer: 'count=exact' }
  for (const table of ['products', 'test_reports']) {
    const rr = await fetch(base + table + '?select=id&limit=1', { headers, signal: ctrl.signal })
    console.log('deployed-key', table, '->', rr.status, rr.headers.get('content-range'), (await rr.text()).slice(0, 100))
  }
} catch (e) { console.log('ERR', e.message) } finally { clearTimeout(t); process.exit(0) }
