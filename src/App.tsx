import React from 'react'
import WatchCard from './components/WatchCard'
import watchesData from './data/watches.json'

export default function App(): JSX.Element {
  // use the watches JSON list
  const tiles = watchesData.map((w, i) => ({ ...w, id: i + 1 }))
  const [sortBy, setSortBy] = React.useState('featured')
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
    return tiles.filter((t) => {
      if (brandFilter !== 'all' && (t.brand || '') !== brandFilter) return false

      // availability filter
      const s = (t.status || '').toString().trim().toLowerCase()
      const availability = s === '' || s === 'no status' ? 'available' : s.includes('sold') ? 'sold' : s.includes('for') || s.includes('sale') ? 'for-sale' : 'available'
      if (availabilityFilter !== 'all' && availability !== availabilityFilter) return false

      return true
    })
  }, [tiles, brandFilter, availabilityFilter])

  return (
    <div className="app">
      <header className="topbar">
        <div className="title">SAK Watch Portfolio</div>
        <div className="toolbar">
          <div className="count">{displayed.length} items</div>
          <div className="brand-filter">
            <label htmlFor="brand-select">Brand</label>
            <select id="brand-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
              <option value="all">All</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="availability-filter">
            <label htmlFor="availability-select">Availability</label>
            <select id="availability-select" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="for-sale">For Sale</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="sort">
            <label htmlFor="sort-select">Sort by</label>
            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
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
