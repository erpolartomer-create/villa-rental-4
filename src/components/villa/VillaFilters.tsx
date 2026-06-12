'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { categories } from '@/lib/data/categories'
import { amenities } from '@/lib/data/amenities'
import { SearchFilters, Locale } from '@/types/villa'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'

interface Props {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  /** When true: renders the full filter panel (for sidebar). When false/omitted: renders mobile trigger + overlay only. */
  sidebar?: boolean
}

const AMENITY_SLUGS = ['pool', 'jacuzzi', 'seaview', 'beachfront', 'kidspool', 'bbq', 'wifi', 'parking']

export function VillaFilters({ filters, onChange, sidebar }: Props) {
  const t = useTranslations('search')
  const locale = useLocale() as Locale
  const [mobileOpen, setMobileOpen] = useState(false)

  const update = (key: keyof SearchFilters, value: unknown) =>
    onChange({ ...filters, [key]: value })

  const toggleCategory = (slug: string) => {
    const cur = filters.categories || []
    update('categories', cur.includes(slug) ? cur.filter(c => c !== slug) : [...cur, slug])
  }

  const toggleAmenity = (slug: string) => {
    const cur = filters.amenities || []
    update('amenities', cur.includes(slug) ? cur.filter(a => a !== slug) : [...cur, slug])
  }

  const clearAll = () => onChange({})

  const activeCount = [
    filters.categories?.length,
    filters.amenities?.length,
    filters.minPrice ? 1 : 0,
    filters.maxPrice ? 1 : 0,
    filters.bedrooms ? 1 : 0,
  ].reduce<number>((sum, n) => sum + (n || 0), 0)

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
        >
          <X size={14} /> Filtreleri Temizle
        </button>
      )}

      {/* Price */}
      <div>
        <p className="text-xs font-bold text-[#1c1712] uppercase tracking-widest mb-3">{t('priceRange')}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-[#9b9389] mb-1 block">{t('min')} (EUR)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={e => update('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-[#e8e3da] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0e3d6e] text-[#1c1712] bg-[#faf9f7]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#9b9389] mb-1 block">{t('max')} (EUR)</label>
            <input
              type="number"
              placeholder="5000"
              value={filters.maxPrice || ''}
              onChange={e => update('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-[#e8e3da] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0e3d6e] text-[#1c1712] bg-[#faf9f7]"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-bold text-[#1c1712] uppercase tracking-widest mb-3">{t('bedrooms')}</p>
        <div className="flex gap-1.5 flex-wrap">
          {([undefined, 1, 2, 3, 4, 5, 6] as const).map(n => (
            <button
              key={n ?? 'any'}
              onClick={() => update('bedrooms', n)}
              className={`px-3 py-1.5 text-sm rounded-xl border transition-all ${
                filters.bedrooms === n
                  ? 'bg-[#0e3d6e] text-white border-[#0e3d6e] shadow-sm'
                  : 'border-[#e8e3da] text-[#6b6154] hover:border-[#0e3d6e] hover:text-[#0e3d6e] bg-white'
              }`}
            >
              {n === undefined ? 'Tümü' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold text-[#1c1712] uppercase tracking-widest mb-3">{t('categories')}</p>
        <div className="space-y-2.5">
          {categories.map(cat => {
            const active = (filters.categories || []).includes(cat.slug)
            return (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${active ? 'bg-[#0e3d6e] border-[#0e3d6e]' : 'border-[#d4cfc8] group-hover:border-[#0e3d6e]'}`}>
                  {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span className="text-sm text-[#6b6154] group-hover:text-[#1c1712] transition-colors">
                  {cat.translations[locale]?.name || cat.translations.tr.name}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-bold text-[#1c1712] uppercase tracking-widest mb-3">{t('amenities')}</p>
        <div className="space-y-2.5">
          {amenities.filter(a => AMENITY_SLUGS.includes(a.slug)).map(amenity => {
            const active = (filters.amenities || []).includes(amenity.slug)
            return (
              <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group">
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${active ? 'bg-[#0e3d6e] border-[#0e3d6e]' : 'border-[#d4cfc8] group-hover:border-[#0e3d6e]'}`}>
                  {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span className="text-sm text-[#6b6154] group-hover:text-[#1c1712] transition-colors">
                  {amenity.translations[locale]}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Sidebar mode: render content directly (no mobile trigger)
  if (sidebar) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1c1712]">Filtreler</h3>
          {activeCount > 0 && (
            <span className="text-xs bg-[#0e3d6e] text-white px-2 py-0.5 rounded-full font-bold">{activeCount}</span>
          )}
        </div>
        <FilterContent />
      </div>
    )
  }

  // Mobile trigger mode
  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 border border-[#e8e3da] rounded-xl text-sm font-medium text-[#1c1712] hover:bg-[#f7f5f0] transition-colors bg-white"
      >
        <SlidersHorizontal size={15} />
        Filtreler
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-[#0e3d6e] text-white rounded-full text-[11px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className="text-[#9b9389]" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#1c1712] text-lg">Filtreler</h3>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#f7f5f0] text-[#9b9389] hover:text-[#1c1712] transition-colors">
                <X size={18} />
              </button>
            </div>
            <FilterContent />
            <div className="mt-8 pt-6 border-t border-[#e8e3da]">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-[#0e3d6e] text-white font-bold rounded-2xl hover:bg-[#0a2d54] transition-colors text-sm"
              >
                Sonuçları Gör ({activeCount > 0 ? `${activeCount} filtre` : 'Tümü'})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
