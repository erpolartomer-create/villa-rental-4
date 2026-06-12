'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { getDiscountedVillas } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { Tag, MapPin, Bed, Bath, Users, Star, Clock, ArrowRight, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'

export function DiscountedVillas() {
  const locale = useLocale() as Locale
  const villas = getDiscountedVillas()
  const { currency } = useCurrencyStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const hasDragged = useRef(false)

  const updateArrows = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    setMounted(true)
    const el = railRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [updateArrows])

  const scrollCarousel = (dir: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    const el = railRef.current
    if (!el) return
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.pageX - el.offsetLeft
    dragScrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = railRef.current
    if (!el) return
    const walk = (e.pageX - el.offsetLeft - dragStartX.current) * 1.3
    if (Math.abs(walk) > 5) hasDragged.current = true
    el.scrollLeft = dragScrollLeft.current - walk
  }

  const stopDrag = () => {
    const el = railRef.current
    if (!el) return
    isDragging.current = false
    el.style.cursor = 'grab'
    el.style.userSelect = ''
  }

  const linkProps = (href: string) => ({
    href,
    draggable: false as const,
    onClick: (e: React.MouseEvent) => { if (hasDragged.current) e.preventDefault() },
  })

  if (villas.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-villa">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <Tag size={11} />
              Son Dakika Fırsatları
            </div>
            <h2 className="heading-section text-[#1c1712]">İndirimli Villalar</h2>
            <p className="text-[#9b9389] text-sm mt-2 max-w-md leading-relaxed">
              Sınırlı süreli özel fiyatlarla hayalinizdeki tatil çok daha uygun.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {/* Deadline badge */}
            <div className="flex items-center gap-2.5 bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-2xl px-4 py-3">
              <Clock size={15} className="text-[#c8892a] shrink-0" />
              <div>
                <div className="text-[10px] text-[#c8892a]/70 font-semibold uppercase tracking-wide leading-none mb-0.5">Son tarih</div>
                <div className="text-sm font-bold text-[#c8892a]">15 Haziran 2026</div>
              </div>
            </div>

            {/* Desktop arrow buttons */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  aria-label="Sola kaydır"
                  className="w-9 h-9 rounded-full border border-[#e8e3da] flex items-center justify-center text-[#1c1712] hover:border-[#c8892a] hover:text-[#c8892a] transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  aria-label="Sağa kaydır"
                  className="w-9 h-9 rounded-full border border-[#e8e3da] flex items-center justify-center text-[#1c1712] hover:border-[#c8892a] hover:text-[#c8892a] transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <Link
              href={`/${locale}/indirimli-villalar`}
              className="group hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-[#c8892a]/15 hover:bg-[#c8892a] border border-[#c8892a]/30 hover:border-[#c8892a] text-[#c8892a] hover:text-white font-semibold text-sm rounded-2xl transition-all duration-300 whitespace-nowrap"
            >
              Tümünü Gör
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Mobile floating arrows */}
          {mounted && (
            <>
              <button
                onClick={() => scrollCarousel('left')}
                aria-label="Sola kaydır"
                className={`sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 shadow-lg border border-[#e8e3da] flex items-center justify-center text-[#1c1712] transition-all duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                aria-label="Sağa kaydır"
                className={`sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 shadow-lg border border-[#e8e3da] flex items-center justify-center text-[#1c1712] transition-all duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Drag rail */}
          <div
            ref={railRef}
            className="overflow-x-auto pb-4 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            <div className="flex gap-5" style={{ width: 'max-content' }}>
              {villas.map(villa => {
                const tr = villa.translations[locale]
                const cover = villa.images.find(i => i.isCover) || villa.images[0]
                const pct = villa.discountPercent!
                const discountedPrice = Math.round(villa.basePricePerNight * (1 - pct / 100))
                const savings = villa.basePricePerNight - discountedPrice
                const favorite = mounted && isFavorite(villa.id)

                return (
                  <div
                    key={villa.id}
                    className="group relative rounded-3xl overflow-hidden shrink-0 w-[280px] h-[390px]"
                  >
                    {/* Full-bleed image link */}
                    <Link {...linkProps(`/${locale}/villas/${villa.slug}`)} className="absolute inset-0 block">
                      <img
                        src={cover?.url}
                        alt={tr.name}
                        draggable={false}
                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
                      />
                    </Link>

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Top: badges + favorite */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.5)]">
                          <Tag size={10} />
                          -{pct}%
                        </div>
                        <div className="inline-flex bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {formatPrice(savings, currency)} tasarruf
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(villa.id)}
                        className="w-9 h-9 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                        aria-label="Favorilere ekle"
                      >
                        <Heart size={15} className={favorite ? 'text-rose-400 fill-rose-400' : 'text-white'} />
                      </button>
                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {/* Location + Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <MapPin size={9} />
                          <span>{villa.locationDistrict}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <Star size={9} className="fill-[#c8892a] text-[#c8892a]" />
                          <span className="text-xs font-bold text-white">{villa.averageRating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Name */}
                      <Link {...linkProps(`/${locale}/villas/${villa.slug}`)}>
                        <h3 className="text-white font-bold text-lg leading-tight mb-3 line-clamp-1 hover:text-[#c8892a] transition-colors">
                          {tr.name}
                        </h3>
                      </Link>

                      {/* Amenity pills */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="bg-white/12 backdrop-blur-sm text-white/75 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bed size={9} /> {villa.bedrooms} oda
                        </span>
                        <span className="bg-white/12 backdrop-blur-sm text-white/75 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bath size={9} /> {villa.bathrooms} banyo
                        </span>
                        <span className="bg-white/12 backdrop-blur-sm text-white/75 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Users size={9} /> {villa.maxGuests} kişi
                        </span>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-white/45 text-xs line-through leading-none mb-0.5">
                            {formatPrice(villa.basePricePerNight, currency)}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-emerald-400 font-bold text-xl leading-none">
                              {formatPrice(discountedPrice, currency)}
                            </span>
                            <span className="text-white/50 text-xs">/ gece</span>
                          </div>
                        </div>
                        <Link
                          {...linkProps(`/${locale}/villas/${villa.slug}`)}
                          className="shrink-0 flex items-center gap-1.5 bg-[#c8892a] hover:bg-[#b07820] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-[0_4px_14px_rgba(200,137,42,0.4)] hover:shadow-[0_6px_20px_rgba(200,137,42,0.55)]"
                        >
                          Detayları Gör
                        </Link>
                      </div>
                    </div>

                    {/* Hover ring */}
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/0 group-hover:ring-red-400/30 transition-all duration-300 pointer-events-none" />
                  </div>
                )
              })}

              {/* End card */}
              <Link
                {...linkProps(`/${locale}/indirimli-villalar`)}
                className="group relative shrink-0 w-[200px] h-[390px] bg-gradient-to-br from-[#fdf3e3] to-[#fff9f0] border-2 border-dashed border-[#c8892a]/30 hover:border-[#c8892a] hover:from-[#fdf3e3] hover:to-[#fef6e7] rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#c8892a]/15 group-hover:bg-[#c8892a]/25 rounded-2xl flex items-center justify-center transition-colors shadow-sm">
                  <ArrowRight size={26} className="text-[#c8892a] group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-center px-4">
                  <div className="font-bold text-[#1c1712] text-sm mb-1">Tüm Fırsatları Gör</div>
                  <div className="text-[#9b9389] text-xs">{villas.length} indirimli villa</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile bottom CTA */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href={`/${locale}/indirimli-villalar`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8892a] hover:bg-[#b07820] text-white text-sm font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.45)]"
          >
            Tüm Fırsatları Gör <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}
