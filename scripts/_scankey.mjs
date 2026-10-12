const url = process.argv[2]
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  const r = await fetch(url, { signal: ctrl.signal })
  const txt = await r.text()
  const pub = txt.match(/sb_publishable_[A-Za-z0-9_-]+/g) || []
  const jwt = txt.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) || []
  console.log('publishable:', [...new Set(pub)].join(' | ') || '(none)')
  console.log('jwt:', [...new Set(jwt)].map(j => j.slice(0, 40) + '...').join(' | ') || '(none)')
} catch (e) { console.log('ERR', e.message) } finally { clearTimeout(t); process.exit(0) }
