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

      // YYYY-MM-DD
      const isoFull = /^(\d{4})-(\d{2})-(\d{2})$/
      const isoYM = /^(\d{4})-(\d{2})$/
      const yearOnly = /^(\d{4})$/
      const monthYear = /^([A-Za-z]+)\s+(\d{4})$/

      let m
      if (m = str.match(isoFull)) {
        const y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3])
        return Date.UTC(y, mo, d)
      }
      if (m = str.match(isoYM)) {
        const y = Number(m[1]), mo = Number(m[2]) - 1
        return Date.UTC(y, mo, 1)
      }
      if (m = str.match(yearOnly)) {
        const y = Number(m[1])
        return Date.UTC(y, 0, 1)
      }
      if (m = str.match(monthYear)) {
        const monthName = m[1].toLowerCase()
        const y = Number(m[2])
        const months: Record<string, number> = { january:0, february:1, march:2, april:3, may:4, june:5, july:6, august:7, september:8, october:9, november:10, december:11 }
        const mo = months[monthName] ?? Object.keys(months).findIndex(k => k.startsWith(monthName.slice(0,3)))
        if (!isNaN(mo) && mo >= 0) return Date.UTC(y, mo, 1)
      }

      // Fallback — try Date.parse and Date constructor (best-effort)
      const t = Date.parse(str)
      if (!isNaN(t)) return t
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
