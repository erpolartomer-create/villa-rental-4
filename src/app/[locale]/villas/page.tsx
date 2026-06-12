'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useVillaStore } from '@/store/villaStore'
import { VillaCard } from '@/components/villa/VillaCard'
import { VillaFilters } from '@/components/villa/VillaFilters'
import { SearchFilters } from '@/types/villa'
import { LayoutGrid, List, ArrowUpDown, Home, ChevronRight, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

type SortKey = 'recommended' | 'priceLow' | 'priceHigh' | 'rating' | 'popular'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: 'Önerilen' },
  { key: 'priceLow',    label: 'Fiyat: Düşükten Yükseğe' },
  { key: 'priceHigh',   label: 'Fiyat: Yüksekten Düşüğe' },
  { key: 'rating',      label: 'En Yüksek Puan' },
  { key: 'popular',     label: 'En Popüler' },
]

export default function VillasPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { getVillas } = useVillaStore()

  const [filters, setFilters] = useState<SearchFilters>({
    checkin:  searchParams.get('checkin')  || undefined,
    checkout: searchParams.get('checkout') || undefined,
    adults:   searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
  })
  const [sort, setSort]   = useState<SortKey>('recommended')
  const [view, setView]   = useState<'grid' | 'list'>('grid')

  const results = useMemo(() => {
    const allVillas = getVillas()
    const list = allVillas.filter(v => {
      if (v.status !== 'active') return false
      if (filters.adults && v.maxGuests < filters.adults) return false
      if (filters.minPrice && v.basePricePerNight < filters.minPrice) return false
      if (filters.maxPrice && v.basePricePerNight > filters.maxPrice) return false
      if (filters.bedrooms && v.bedrooms < filters.bedrooms) return false
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.some(c => v.categories.includes(c))) return false
      }
      if (filters.amenities && filters.amenities.length > 0) {
        if (!filters.amenities.every(a => v.amenities.includes(a))) return false
      }
      return true
    })
    switch (sort) {
      case 'priceLow':  return [...list].sort((a, b) => a.basePricePerNight - b.basePricePerNight)
      case 'priceHigh': return [...list].sort((a, b) => b.basePricePerNight - a.basePricePerNight)
      case 'rating':    return [...list].sort((a, b) => b.averageRating - a.averageRating)
      case 'popular':   return [...list].sort((a, b) => b.viewCount - a.viewCount)
      default:          return [...list].sort((a, b) => a.sortOrder - b.sortOrder)
    }
  }, [filters, sort])

  const activeChips = [
    ...(filters.categories?.map(c => ({
      label: c,
      remove: () => setFilters(f => ({ ...f, categories: f.categories?.filter(x => x !== c) })),
    })) || []),
    ...(filters.amenities?.map(a => ({
      label: a,
      remove: () => setFilters(f => ({ ...f, amenities: f.amenities?.filter(x => x !== a) })),
    })) || []),
    ...(filters.bedrooms ? [{
      label: `${filters.bedrooms}+ Yatak`,
      remove: () => setFilters(f => ({ ...f, bedrooms: undefined })),
    }] : []),
    ...(filters.minPrice ? [{
      label: `Min ${filters.minPrice}€`,
      remove: () => setFilters(f => ({ ...f, minPrice: undefined })),
    }] : []),
    ...(filters.maxPrice ? [{
      label: `Max ${filters.maxPrice}€`,
      remove: () => setFilters(f => ({ ...f, maxPrice: undefined })),
    }] : []),
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f5f0' }}>

      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        {/* Background image */}
        <img
          src="/images/hero_bg.png"
          alt="Kaş Kalkan villa"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* Decorative circle */}
        <div className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full border border-white/5 opacity-40" />
        <div className="absolute -right-16 -top-16 w-[320px] h-[320px] rounded-full border border-white/5 opacity-30" />

        {/* Content */}
        <div className="relative z-10 container-villa pt-32 pb-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href={`/${locale}`} className="hover:text-white/80 transition-colors flex items-center gap-1">
              <Home size={11} /> Anasayfa
            </Link>
            <ChevronRight size={11} />
            <span className="text-white/75">Tüm Villalar</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Kaş &amp; Kalkan · Premium Villalar</span>
          </div>

          {/* Heading */}
          <h1 className="heading-display text-white mb-4 max-w-lg">
            Tüm Villalar
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-white/60 text-sm">
              <span className="text-white font-bold text-lg">{results.length}</span> villa listeleniyor
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5 text-white/55 text-sm">
              <MapPin size={12} className="text-[#c8892a]" /> Kaş, Kalkan, Patara
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5 text-white/55 text-sm">
              <Star size={12} className="text-[#c8892a] fill-[#c8892a]" /> 4.8 ortalama puan
            </span>
          </div>
        </div>

      </div>

      {/* Main layout */}
      <div className="container-villa py-8">
        <div className="flex gap-7">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="scrollbar-hover sticky top-24 bg-white rounded-2xl border border-[#e8e3da] shadow-[0_2px_16px_rgba(28,23,18,0.05)]" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}><div className="p-5">
              <VillaFilters sidebar filters={filters} onChange={setFilters} />
            </div></div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                {/* Mobile filter trigger */}
                <VillaFilters filters={filters} onChange={setFilters} />
                <span className="text-[#9b9389] text-sm hidden sm:block">
                  <strong className="text-[#1c1712] font-semibold">{results.length}</strong> sonuç
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-2 bg-white border border-[#e8e3da] rounded-xl px-3 py-2">
                  <ArrowUpDown size={13} className="text-[#9b9389] shrink-0" />
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortKey)}
                    className="text-sm focus:outline-none text-[#1c1712] bg-transparent cursor-pointer"
                  >
                    {sortOptions.map(o => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex border border-[#e8e3da] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-[#0e3d6e] text-white' : 'text-[#9b9389] hover:bg-[#f7f5f0]'}`}
                    aria-label="Izgara görünüm"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2.5 transition-colors ${view === 'list' ? 'bg-[#0e3d6e] text-white' : 'text-[#9b9389] hover:bg-[#f7f5f0]'}`}
                    aria-label="Liste görünüm"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeChips.map(chip => (
                  <span
                    key={chip.label}
                    className="flex items-center gap-1.5 bg-[#e8f0f8] text-[#0e3d6e] text-xs px-3 py-1.5 rounded-full font-medium"
                  >
                    {chip.label}
                    <button
                      onClick={chip.remove}
                      className="w-3.5 h-3.5 rounded-full bg-[#0e3d6e]/15 hover:bg-[#0e3d6e]/30 flex items-center justify-center transition-colors"
                      aria-label="Filtreyi kaldır"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setFilters({})}
                  className="text-xs text-[#9b9389] hover:text-rose-500 transition-colors px-1"
                >
                  Tümünü temizle
                </button>
              </div>
            )}

            {/* Results */}
            {results.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-[#e8e3da]">
                <div className="w-16 h-16 bg-[#f0ede6] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🏠
                </div>
                <h3 className="text-lg font-bold text-[#1c1712] mb-2">Sonuç bulunamadı</h3>
                <p className="text-[#9b9389] text-sm mb-6">Farklı filtreler deneyin</p>
                <button
                  onClick={() => setFilters({})}
                  className="px-5 py-2.5 bg-[#0e3d6e] text-white rounded-xl hover:bg-[#0a2d54] transition-colors text-sm font-medium"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5'
                  : 'grid grid-cols-1 gap-5'
              }>
                {results.map(villa => (
                  <VillaCard key={villa.id} villa={villa} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
