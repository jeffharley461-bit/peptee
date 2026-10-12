const url = process.argv[2]
const needles = process.argv.slice(3)
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  const r = await fetch(url, { signal: ctrl.signal })
  const txt = await r.text()
  console.log('status', r.status, 'bytes', txt.length)
  for (const n of needles) console.log(`  ${n}: ${txt.includes(n)}`)
} catch (e) { console.log('ERR', e.message) } finally { clearTimeout(t); process.exit(0) }
