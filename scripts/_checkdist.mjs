const fs = require('fs')
const p = 'C:/Users/Willian/Desktop/work ai/wills/peptee/dist/assets/index-BaatcUgl.js'
const s = fs.readFileSync(p, 'utf8')
console.log(s.includes('Frequently Asked Questions'))
console.log(s.includes('md:grid-cols-2'))
process.exit(0)
