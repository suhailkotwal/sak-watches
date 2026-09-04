import React from 'react'
import WatchCard from './components/WatchCard'
import Filters from './components/Filters'
import watchesData from './data/watches.json'

export default function App(): JSX.Element {
  // use the watches JSON list
  const tiles = watchesData.map((w, i) => ({ ...w, id: i + 1 }))
  const [sortBy, setSortBy] = React.useState('newest')
  const [brandFilter, setBrandFilter] = React.useState('all')
  const [availabilityFilter, setAvailabilityFilter] = React.useState('all')

  const brands = React.useMemo(() => {
    const set = new Set<string>()
    tiles.forEach((t) => {
      if (t.brand && t.brand.trim()) set.add(t.brand)
    })
    return Array.from(set).sort()
  }, [tiles])

  const displayed = React.useMemo(() => {
    const filtered = tiles.filter((t) => {
      if (brandFilter !== 'all' && (t.brand || '') !== brandFilter) return false

      // availability filter
      const s = (t.status || '').toString().trim().toLowerCase()
      const availability = s === '' || s === 'no status' ? 'available' : s.includes('sold') ? 'sold' : s.includes('for') || s.includes('sale') ? 'for-sale' : 'available'
      if (availabilityFilter !== 'all' && availability !== availabilityFilter) return false

      return true
    })

    // Sorting
    const parseDate = (s?: any) => {
      if (!s) return 0
      const str = String(s).trim()
      const t = Date.parse(str)
      if (!isNaN(t)) return t
      // try month-year like 'June 2025' -> parse as first of month
      try {
        const d = new Date(str)
        const v = d.getTime()
        return isNaN(v) ? 0 : v
      } catch (e) {
        return 0
      }
    }

    const getRelevant = (item: any) => {
      // prefer purchase_date, fall back to sold_date
      return parseDate(item.purchase_date) || parseDate(item.sold_date) || 0
    }

    // Helper to derive status group: 0 = regular/no-status, 1 = sale/for-sale, 2 = sold
    const statusGroup = (item: any) => {
      const s = (item.status || '').toString().trim().toLowerCase()
      if (s === '' || s === 'no status') return 0
      if (s.includes('for') || s.includes('sale')) return 1
      if (s.includes('sold')) return 2
      return 0
    }

    // Always place pinned items first (if item.pinned === true). Within each partition,
    // order by status group (regular -> sale -> sold) and then by date (newest first).
    if (sortBy === 'newest' || sortBy === 'featured') {
      filtered.sort((a, b) => {
        const aStatus = (a.status || '').toString().toLowerCase()
        const bStatus = (b.status || '').toString().toLowerCase()
        const aPinned = aStatus.includes('pinned')
        const bPinned = bStatus.includes('pinned')
        if (aPinned && !bPinned) return -1
        if (!aPinned && bPinned) return 1

        const ag = statusGroup(a)
        const bg = statusGroup(b)
        if (ag !== bg) return ag - bg

        return getRelevant(b) - getRelevant(a)
      })
    } else if (sortBy === 'price-asc') {
      // Keep pinned first for price sorts as well
      filtered.sort((a, b) => {
        const aStatus = (a.status || '').toString().toLowerCase()
        const bStatus = (b.status || '').toString().toLowerCase()
        const aPinned = aStatus.includes('pinned')
        const bPinned = bStatus.includes('pinned')
        if (aPinned && !bPinned) return -1
        if (!aPinned && bPinned) return 1
        return (Number(a.purchase_price) || 0) - (Number(b.purchase_price) || 0)
      })
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        const aStatus = (a.status || '').toString().toLowerCase()
        const bStatus = (b.status || '').toString().toLowerCase()
        const aPinned = aStatus.includes('pinned')
        const bPinned = bStatus.includes('pinned')
        if (aPinned && !bPinned) return -1
        if (!aPinned && bPinned) return 1
        return (Number(b.purchase_price) || 0) - (Number(a.purchase_price) || 0)
      })
    }

    return filtered
  }, [tiles, brandFilter, availabilityFilter, sortBy])

  const [filtersOpen, setFiltersOpen] = React.useState(false)

  return (
    <div className="app">
      <header className="topbar">
        <div className="top-row">
          <div className="title">SAK Watch Portfolio</div>
          <div className="count">{displayed.length} items</div>
        </div>
        <div className="toolbar">
          <Filters
            brands={brands}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </header>

      <main>
        <section className="cards">
          {displayed.map((w) => (
            <WatchCard key={w.id} watch={w} />
          ))}
        </section>
      </main>
    </div>
  )
}
