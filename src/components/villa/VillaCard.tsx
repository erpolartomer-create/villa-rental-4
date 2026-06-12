'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Bed, Bath, Users, Heart, Star, MapPin } from 'lucide-react'
import { Villa, Locale } from '@/types/villa'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { useFavoritesStore } from '@/store/favoritesStore'

interface Props {
  villa: Villa
  compact?: boolean
}

export function VillaCard({ villa, compact = false }: Props) {
  const locale = useLocale() as Locale
  const { currency } = useCurrencyStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  // Defer favorites to client to avoid hydration mismatch with persisted store
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const translation = villa.translations[locale]
  const coverImage = villa.images.find(i => i.isCover) || villa.images[0]
  const favorite = mounted && isFavorite(villa.id)

  return (
    <div className={`group relative rounded-3xl overflow-hidden ${compact ? 'h-64' : 'h-[380px] sm:h-[420px]'}`}>
      {/* Full-bleed image */}
      <Link href={`/${locale}/villas/${villa.slug}`} className="absolute inset-0 block">
        <img
          src={coverImage?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700'}
          alt={coverImage?.altText || translation.name}
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
        />
      </Link>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/0 group-hover:from-black/95 transition-all duration-500 pointer-events-none" />

      {/* Top: badges + favorite */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex flex-wrap gap-1.5">
          {villa.discountPercent && villa.discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_2px_10px_rgba(239,68,68,0.55)]">
              -{villa.discountPercent}%
            </span>
          )}
          {villa.isFeatured && (
            <span className="bg-[#c8892a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(200,137,42,0.5)]">
              Öne Çıkan
            </span>
          )}
          {villa.isHoneymoon && (
            <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              Balayı
            </span>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(villa.id)}
          className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
          aria-label="Favorilere ekle"
        >
          <Heart
            size={16}
            className={favorite ? 'text-rose-400 fill-rose-400' : 'text-white'}
          />
        </button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Location + Rating */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <MapPin size={10} />
            <span>{villa.locationDistrict}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star size={11} className="text-[#c8892a] fill-[#c8892a]" />
            <span className="text-xs font-bold text-white">{villa.averageRating.toFixed(1)}</span>
            <span className="text-white/50 text-[11px]">({villa.reviewCount})</span>
          </div>
        </div>

        {/* Name */}
        <Link href={`/${locale}/villas/${villa.slug}`}>
          <h3 className="font-bold text-white text-xl leading-tight mb-3 hover:text-[#c8892a] transition-colors line-clamp-1">
            {translation.name}
          </h3>
        </Link>

        {/* Amenity pills */}
        {!compact && (
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/12 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Bed size={10} /> {villa.bedrooms} oda
            </span>
            <span className="bg-white/12 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Bath size={10} /> {villa.bathrooms} banyo
            </span>
            <span className="bg-white/12 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Users size={10} /> {villa.maxGuests} kişi
            </span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {villa.discountPercent && villa.discountPercent > 0 ? (
              <>
                <div className="text-white/45 text-[11px] line-through mb-0.5">
                  {formatPrice(villa.basePricePerNight, currency)}
                </div>
                <div className="text-emerald-400 font-bold text-xl leading-none">
                  {formatPrice(Math.round(villa.basePricePerNight * (1 - villa.discountPercent / 100)), currency)}
                  <span className="text-xs font-normal text-white/55 ml-1">/ gece</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-white/45 text-[11px] mb-0.5">başlayan fiyatla</div>
                <div className="text-white font-bold text-xl leading-none">
                  {formatPrice(villa.basePricePerNight, currency)}
                  <span className="text-xs font-normal text-white/55 ml-1">/ gece</span>
                </div>
              </>
            )}
          </div>
          <Link
            href={`/${locale}/villas/${villa.slug}`}
            className="shrink-0 flex items-center gap-1.5 bg-[#c8892a] hover:bg-[#b07820] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(200,137,42,0.4)] hover:shadow-[0_6px_20px_rgba(200,137,42,0.55)]"
          >
            Detayları Gör
          </Link>
        </div>
      </div>

      {/* Hover ring glow */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/0 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
    </div>
  )
}
