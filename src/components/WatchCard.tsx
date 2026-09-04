import React from 'react'
import imageAttrs from '../utils/image'

type Watch = {
  id?: number
  name?: string
  title?: string
  company?: string
  brand?: string
  price?: string
  description?: string
  image?: string
  year?: number
  status?: 'sold' | 'for sale' | 'no status' | string
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const sraw = String(status).trim().toLowerCase()
  if (sraw === 'no status' || sraw === 'none' || sraw === '') return null
  const s = status.toLowerCase()
  let bg = '#6b7280'
  if (s.includes('sold')) bg = '#ef4444'
  else if (s.includes('for')) bg = '#10b981'
  return <span className="status-badge" style={{ background: bg }}>{status}</span>
}

export default function WatchCard({ watch }: { watch: Watch }) {
  const name = watch.name ?? watch.title ?? 'Untitled'
  const company = watch.company ?? watch.brand ?? ''

  const img = imageAttrs(watch.image)

  return (
    <article className="card">
      {watch.year ? <span className="card-badge">{watch.year}</span> : null}
      <img
        className="card-image"
        src={img.src}
        srcSet={img.srcSet}
        sizes={img.sizes}
        alt={name}
        loading="lazy"
        decoding="async"
      />
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">{name}</h3>
          <StatusBadge status={watch.status} />
        </div>
        {company ? <p className="card-brand">{company}</p> : null}
      </div>
    </article>
  )
}
