const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function run() {
  const input = process.argv[2]
  if (!input) {
    console.error('Usage: node scripts/convert-image.js <path-to-image> [slug]')
    process.exit(1)
  }

  const abs = path.resolve(input)
  const stat = await fs.stat(abs).catch(() => null)
  if (!stat) {
    console.error('File not found:', abs)
    process.exit(1)
  }

  const slug = process.argv[3] || path.basename(input, path.extname(input)).replace(/\s+/g, '-').toLowerCase()
  const outDir = path.resolve(__dirname, '../public/images')
  await ensureDir(outDir)

  const sizes = [320, 520, 800]
  for (const s of sizes) {
    const out = path.join(outDir, `${slug}-${s}.webp`)
    await sharp(abs).resize(s, s, { fit: 'cover' }).webp({ quality: 80 }).toFile(out)
    console.log('Wrote', out)
  }

  console.log('\nFinished generating thumbnails. You can reference them at `/images/' + slug + '-<size>.webp`')
}

run().catch(err => {
  console.error(err)
  process.exitCode = 1
})
