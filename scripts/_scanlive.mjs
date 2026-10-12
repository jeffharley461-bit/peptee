const url = process.argv[2] || 'https://peptee.vercel.app/assets/index-BWcs72Zw.js'
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 25000)
try {
  const r = await fetch(url, { signal: ctrl.signal })
  console.log('status', r.status)
  const txt = await r.text()
  console.log('bytes', txt.length)
  const urls = new Set(txt.match(/https:\/\/[a-z0-9]+\.supabase\.co/g) || [])
  console.log('placeholder present:', txt.includes('placeholder.supabase.co'))
  console.log('supabase urls:', [...urls].join(', ') || '(none)')
} catch (e) {
  console.log('ERR', e.message)
} finally {
  clearTimeout(t)
  process.exit(0)
}
