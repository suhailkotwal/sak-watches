const fs = require('fs').promises
const path = require('path')
const { optimize } = require('svgo')
const sharp = require('sharp')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function run() {
  const svgSrc = path.resolve(__dirname, '../public/icons/default.svg')
  const svgMin = path.resolve(__dirname, '../public/icons/default.min.svg')
  const outIcons = path.resolve(__dirname, '../public/icons')
  const outImages = path.resolve(__dirname, '../public/images')

  try {
    const raw = await fs.readFile(svgSrc, 'utf8')
    const result = optimize(raw, { path: svgSrc })
    await ensureDir(outIcons)
    await ensureDir(outImages)
    await fs.writeFile(svgMin, result.data, 'utf8')
    console.log('Optimized SVG written to', svgMin)

    // Generate PNG icons for manifest
    const manifestSizes = [192, 512]
    for (const size of manifestSizes) {
      const outPng = path.join(outIcons, `icon-${size}.png`)
      await sharp(Buffer.from(result.data)).resize(size, size, { fit: 'contain' }).png({ quality: 90 }).toFile(outPng)
      console.log('Wrote', outPng)
    }

    // Generate WebP thumbnails
    const thumbs = [320, 520, 800]
    for (const t of thumbs) {
      const outWebp = path.join(outImages, `thumb-${t}.webp`)
      await sharp(Buffer.from(result.data)).resize(t, t, { fit: 'contain' }).webp({ quality: 80 }).toFile(outWebp)
      console.log('Wrote', outWebp)
    }

    console.log('\nDone. Update `manifest.webmanifest` to reference `icons/icon-192.png` and `icons/icon-512.png` if needed.')
  } catch (err) {
    console.error('generate-icons failed:', err)
    process.exitCode = 1
  }
}

run()
