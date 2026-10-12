import React from 'react'
import { AVAILABILITY_FILTER_OPTIONS } from '../data/availability'

export default function Filters({
  brands,
  brandFilter,
  setBrandFilter,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
}: {
  brands: string[]
  brandFilter: string
  setBrandFilter: (b: string) => void
  availabilityFilter: string
  setAvailabilityFilter: (s: string) => void
  sortBy: string
  setSortBy: (s: string) => void
}) {
  return (
    <>
      <div className="count">{/* preserved for layout when used inline */}</div>
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
          {AVAILABILITY_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
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
    </>
  )
}
