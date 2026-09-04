export const DEFAULT_ICON = '/icons/default.svg'

type ImageAttrs = {
  src: string
  srcSet?: string
  sizes?: string
}

// sizes hint used by WatchCard; adjust to match card CSS if needed
const DEFAULT_SIZES = '(max-width:600px) 50vw, 200px'

/**
 * Given an image path from the data, return attributes for responsive <img>.
 * - If image points to generated `/images/<slug>-320.webp`, produces srcset for 320/520/800.
 * - Otherwise returns a simple src (for SVG or single-file bitmaps).
 */
export function imageAttrs(imagePath?: string): ImageAttrs {
  if (!imagePath) return { src: DEFAULT_ICON }

  // Normalize
  let p = String(imagePath)

  // If path is absolute (starts with '/'), convert to BASE_URL-relative so GitHub Pages resolves correctly
  const base = typeof import.meta !== 'undefined' ? (import.meta.env.BASE_URL || '/') : '/'
  if (p.startsWith('/')) {
    p = `${base}${p.slice(1)}`
  }

  // If it's already an images/thumb with a -320 suffix, derive the slug
  const m = p.match(/(?:^|\/)(images)\/(.+)-320\.(webp|png|jpg|jpeg)$/i)
  if (m) {
    const slug = m[2]
    const src320 = `${base}images/${slug}-320.webp`
    const src520 = `${base}images/${slug}-520.webp`
    const src800 = `${base}images/${slug}-800.webp`
    return {
      src: src320,
      srcSet: `${src320} 320w, ${src520} 520w, ${src800} 800w`,
      sizes: DEFAULT_SIZES,
    }
  }
  // If path already references an images file but not -320, try to infer base slug
  const m2 = p.match(/(?:^|\/)(images)\/(.+)-(?:320|520|800)\.(webp|png|jpg|jpeg)$/i)
  if (m2) {
    const slug = m2[2]
    const src320 = `${base}images/${slug}-320.webp`
    const src520 = `${base}images/${slug}-520.webp`
    const src800 = `${base}images/${slug}-800.webp`
    return {
      src: src320,
      srcSet: `${src320} 320w, ${src520} 520w, ${src800} 800w`,
      sizes: DEFAULT_SIZES,
    }
  }

  // For icons (SVG) or other single-file images, return src; ensure BASE_URL prefix if needed
  if (p.startsWith(base)) return { src: p }
  return { src: `${base}${p}` }
}

export default imageAttrs
