'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { categories } from '@/lib/data/categories'
import { villas } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { ArrowRight, LayoutGrid, Crown, Waves, Heart, Users, Lock, Umbrella, PawPrint, Gem, type LucideIcon } from 'lucide-react'

const categoryIcons: Record<string, LucideIcon> = {
  luxury:       Crown,
  seaview:      Waves,
  honeymoon:    Heart,
  family:       Users,
  conservative: Lock,
  beachfront:   Umbrella,
  petfriendly:  PawPrint,
  boutique:     Gem,
}

const categoryImages: Record<string, string> = {
  luxury:       '/images/cat_luxury.png',
  seaview:      '/images/kaputas_beach.png',
  honeymoon:    '/images/cat_honeymoon.png',
  family:       '/images/cat_nature.png',
  conservative: '/images/cat_conservative.png',
  beachfront:   '/images/cat_beachfront.png',
  petfriendly:  '/images/cat_pet_friendly.png',
  boutique:     '/images/cat_boutique.png',
}

// Categories 0-1 and 6-7 are featured (col-span-2, taller)
// Categories 2-5 are regular (col-span-1, shorter)
const FEATURED = new Set(['luxury', 'seaview', 'petfriendly', 'boutique'])

export function CategoryGrid() {
  const t = useTranslations('home.categories')
  const locale = useLocale() as Locale

  const villaCount: Record<string, number> = {}
  categories.forEach(cat => {
    villaCount[cat.slug] = villas.filter(v => v.categories?.includes(cat.slug)).length
  })

  return (
    <section className="section-padding bg-white">
      <div className="container-villa">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <LayoutGrid size={11} />
              Kategoriler
            </div>
            <h2 className="heading-section text-[#1c1712]">{t('title')}</h2>
          </div>
          <Link
            href={`/${locale}/villas`}
            className="group hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-[#c8892a]/15 hover:bg-[#c8892a] border border-[#c8892a]/30 hover:border-[#c8892a] text-[#c8892a] hover:text-white font-semibold text-sm rounded-2xl transition-all duration-300 whitespace-nowrap"
          >
            Tüm Villalar
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/*
          Bento grid layout (4 cols on lg, 2 cols on mobile):
          Row 1 (tall)   : [luxury  span-2] [seaview      span-2]
          Row 2 (medium) : [honeymoon] [family] [conservative] [beachfront]
          Row 3 (tall)   : [petfriendly span-2] [boutique span-2]
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map(cat => {
            const name = cat.translations[locale]?.name || cat.translations.tr.name
            const desc = cat.translations[locale]?.description || cat.translations.tr.description
            const featured = FEATURED.has(cat.slug)
            const count = villaCount[cat.slug] ?? 0
            const Icon = categoryIcons[cat.slug]

            return (
              <Link
                key={cat.id}
                href={`/${locale}/categories/${cat.slug}`}
                className={`group relative overflow-hidden rounded-3xl block ${
                  featured ? 'col-span-2' : 'col-span-1'
                } ${featured ? 'h-52 sm:h-64 lg:h-[300px]' : 'h-40 sm:h-48 lg:h-56'}`}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={categoryImages[cat.slug] || '/images/cat_luxury.png'}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Layered gradient: strong bottom, light top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 group-hover:from-black/95 transition-all duration-500" />
                  {/* Subtle vignette on hover */}
                  <div className="absolute inset-0 bg-[#c8892a]/0 group-hover:bg-[#c8892a]/8 transition-all duration-500" />
                </div>

                {/* Top row: villa count pill + icon badge */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <div className="bg-white/90 backdrop-blur-sm text-[#1c1712] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {count > 0 ? `${count} villa` : 'Yeni'}
                  </div>
                  {Icon && (
                  <div className="w-10 h-10 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] group-hover:bg-white/25 group-hover:border-white/50 group-hover:scale-110 transition-all duration-300">
                    <Icon size={18} className="text-white" />
                  </div>
                  )}
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  {featured && desc && (
                    <p className="text-white/55 text-xs sm:text-sm leading-relaxed line-clamp-1 mb-2 hidden sm:block">
                      {desc}
                    </p>
                  )}
                  <div className="flex items-end justify-between gap-2">
                    <h3 className={`text-white font-bold leading-tight ${featured ? 'text-lg sm:text-xl lg:text-2xl' : 'text-sm sm:text-base'}`}>
                      {name}
                    </h3>
                    {/* Animated arrow pill */}
                    <div className="flex items-center gap-1.5 bg-white/15 group-hover:bg-[#c8892a] backdrop-blur-sm rounded-full pl-2.5 pr-1.5 py-1 text-white text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                      Keşfet
                      <div className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                        <ArrowRight size={9} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/0 group-hover:ring-white/25 transition-all duration-300 pointer-events-none" />
              </Link>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/villas`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8892a] hover:bg-[#b07820] text-white text-sm font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.45)]"
          >
            Tüm Villalar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
