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
  const p = String(imagePath)

  // If it's already an images/thumb with a -320 suffix, derive the slug
  const m = p.match(/\/images\/(.+)-320\.(webp|png|jpg|jpeg)$/i)
  if (m) {
    const slug = m[1]
    const src320 = `/images/${slug}-320.webp`
    const src520 = `/images/${slug}-520.webp`
    const src800 = `/images/${slug}-800.webp`
    return {
      src: src320,
      srcSet: `${src320} 320w, ${src520} 520w, ${src800} 800w`,
      sizes: DEFAULT_SIZES,
    }
  }

  // If path already references an images file but not -320, try to infer base slug
  const m2 = p.match(/\/images\/(.+)-(?:320|520|800)\.(webp|png|jpg|jpeg)$/i)
  if (m2) {
    const slug = m2[1]
    const src320 = `/images/${slug}-320.webp`
    const src520 = `/images/${slug}-520.webp`
    const src800 = `/images/${slug}-800.webp`
    return {
      src: src320,
      srcSet: `${src320} 320w, ${src520} 520w, ${src800} 800w`,
      sizes: DEFAULT_SIZES,
    }
  }

  // For icons (SVG) or other single-file images, just return src as-is
  return { src: p }
}

export default imageAttrs
