const indexUrl = process.argv[2] || 'https://peptee.vercel.app/assets/index-BWcs72Zw.js'
const origin = new URL(indexUrl).origin
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  const r = await fetch(indexUrl, { signal: ctrl.signal })
  const txt = await r.text()
  const chunks = [...new Set(txt.match(/assets\/[A-Za-z0-9._-]+\.js/g) || [])]
  console.log('chunks referenced:', chunks.length)
  let bad = 0
  for (const c of chunks) {
    const rr = await fetch(origin + '/' + c, { signal: ctrl.signal, method: 'GET' })
    if (rr.status !== 200) { bad++; console.log('  BAD', rr.status, c) }
  }
  console.log(bad === 0 ? 'all chunks 200 OK' : `${bad} bad chunk(s)`)
} catch (e) { console.log('ERR', e.message) } finally { clearTimeout(t); process.exit(0) }
