'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Heart, ArrowRight, Trash2, Home } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { VillaCard } from '@/components/villa/VillaCard'
import { villas } from '@/lib/data/villas'
import { Locale } from '@/types/villa'

export default function FavoritesPage() {
  const locale = useLocale() as Locale
  const { favorites, toggleFavorite } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Wait for client hydration before reading localStorage store
  const favoriteVillas = mounted
    ? villas.filter(v => favorites.includes(v.id) && v.status === 'active')
    : []

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '30vh' }}>
        <div className="absolute inset-0">
          <img
            src="/images/cat_luxury.png"
            alt="Favoriler"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/80" />
          <div className="absolute bottom-0 left-1/3 w-80 h-32 bg-[#c8892a]/10 blur-[70px]" />
        </div>
        <div className="relative z-10 container-villa flex flex-col justify-end pt-28 pb-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 w-fit">
            <Heart size={11} className="fill-rose-300" />
            Favorilerim
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-2">
            Favori Villalarım
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            {mounted && favoriteVillas.length > 0
              ? `${favoriteVillas.length} villa favorilerinizde`
              : 'Beğendiğiniz villaları buradan takip edin'}
          </p>
        </div>
      </div>

      <div className="container-villa py-10 pb-20">

        {/* ── Loaded: has favorites ── */}
        {mounted && favoriteVillas.length > 0 && (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-7">
              <p className="text-[#9b9389] text-sm">
                <span className="font-bold text-[#1c1712]">{favoriteVillas.length}</span> villa favorilerinizde
              </p>
              <button
                onClick={() => favorites.forEach(id => toggleFavorite(id))}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#9b9389] hover:text-rose-500 border border-[#e8e3da] hover:border-rose-200 bg-white rounded-xl transition-all"
              >
                <Trash2 size={12} />
                Tümünü Temizle
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteVillas.map(villa => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>

            {/* Browse more */}
            <div className="mt-12 text-center">
              <Link
                href={`/${locale}/villas`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#c8892a]/10 hover:bg-[#c8892a]/20 border border-[#c8892a]/30 text-[#c8892a] font-semibold text-sm rounded-2xl transition-all"
              >
                <Home size={15} />
                Daha Fazla Villa Keşfet
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {mounted && favoriteVillas.length === 0 && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-24 h-24 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-rose-300" />
            </div>
            <h2 className="text-2xl font-black text-[#1c1712] tracking-tight mb-3">
              Henüz favori villa yok
            </h2>
            <p className="text-[#9b9389] text-sm leading-relaxed mb-8">
              Villa listesini gezerek beğendiklerinizin üzerindeki kalp ikonuna tıklayın.
              Favorileriniz burada görünecek.
            </p>
            <Link
              href={`/${locale}/villas`}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.4)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.55)]"
            >
              Villaları Keşfet
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── Loading skeleton (before hydration) ── */}
        {!mounted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[380px] bg-[#e8e3da] rounded-3xl animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
