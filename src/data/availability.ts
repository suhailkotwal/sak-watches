export const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'lent', label: 'Lent' },
  { value: 'anjum', label: 'Anjum' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'sold', label: 'Sold' },
] as const

export const AVAILABILITY_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...AVAILABILITY_OPTIONS,
] as const

export const AVAILABILITY_ORDER: Record<string, number> = {
  available: 0,
  'for-sale': 1,
  lent: 2,
  anjum: 3,
  inactive: 4,
  sold: 5,
}

export function getAvailabilityValue(status: string | null | undefined): (typeof AVAILABILITY_OPTIONS)[number]['value'] {
  const s = (status ?? '').toString().trim().toLowerCase()

  if (s === '' || s === 'no status') return 'available'
  if (s.includes('sold')) return 'sold'
  if (s.includes('for') || s.includes('sale')) return 'for-sale'
  if (s.includes('lent')) return 'lent'
  if (s.includes('anjum')) return 'anjum'
  if (s.includes('inactive')) return 'inactive'

  return 'available'
}
