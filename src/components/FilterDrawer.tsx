import React from 'react'

export default function FilterDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close filters">✕</button>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  )
}
