'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { getHoneymoonVillas } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { Star, ArrowRight, MapPin, Bed, Users, Heart } from 'lucide-react'

export function HoneymoonVillas() {
  const t = useTranslations('home.honeymoon')
  const locale = useLocale() as Locale
  const villas = getHoneymoonVillas().slice(0, 4)
  const { currency } = useCurrencyStore()

  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background — same approach as WizardCTA */}
      <div className="absolute inset-0">
        <img
          src="/images/cat_honeymoon.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071220]/75 via-[#0a1a2e]/88 to-[#0a1a2e]/97" />
        {/* Gold accent glow */}
        <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[500px] h-64 bg-[#c8892a]/8 blur-[90px] rounded-full" />
        <div className="absolute top-0 right-1/4 w-[400px] h-48 bg-[#c8892a]/5 blur-[70px] rounded-full" />
      </div>

      <div className="relative z-10 container-villa py-24">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

          {/* Left: editorial text block */}
          <div className="lg:w-[38%] lg:sticky lg:top-28 pt-2">
            {/* Badge — WizardCTA style with gold */}
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-7">
              <Heart size={11} className="fill-[#c8892a]" />
              {t('badge')}
            </div>

            <h2 className="heading-section text-white mb-5 leading-[1.1]">
              {t('title')}
            </h2>

            {/* Gold decorative divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[#c8892a]/50 to-transparent" />
              <span className="text-[#c8892a] text-sm leading-none">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#c8892a]/50 to-transparent" />
            </div>

            <p className="text-white/55 text-base leading-relaxed mb-8">
              {t('subtitle')}
            </p>

            {/* CTA — WizardCTA gold button */}
            <Link
              href={`/${locale}/categories/honeymoon`}
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl transition-all text-sm shadow-[0_8px_32px_rgba(200,137,42,0.45)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.6)] hover:-translate-y-0.5"
            >
              {t('cta')}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Stats — WizardCTA-style mini cards */}
            <div className="mt-10 grid grid-cols-3 gap-3 pt-8 border-t border-white/10">
              <div className="bg-white/7 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-4 text-center">
                <div className="text-xl font-black text-white tracking-tight">4.9<span className="text-[#c8892a]">★</span></div>
                <div className="text-white/40 text-[11px] mt-1 leading-tight">Ortalama puan</div>
              </div>
              <div className="bg-white/7 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-4 text-center">
                <div className="text-xl font-black text-white tracking-tight">500+</div>
                <div className="text-white/40 text-[11px] mt-1 leading-tight">Çift tatil yaptı</div>
              </div>
              <div className="bg-white/7 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-4 text-center">
                <div className="text-xl font-black text-white tracking-tight">%100</div>
                <div className="text-white/40 text-[11px] mt-1 leading-tight">Memnuniyet</div>
              </div>
            </div>
          </div>

          {/* Right: villa cards grid */}
          <div className="lg:w-[62%] grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {villas.map(villa => {
              const tr = villa.translations[locale]
              const cover = villa.images.find(i => i.isCover) || villa.images[0]
              return (
                <Link
                  key={villa.id}
                  href={`/${locale}/villas/${villa.slug}`}
                  className="group relative rounded-3xl overflow-hidden block h-[265px] sm:h-[285px]"
                >
                  {/* Full-bleed image */}
                  <img
                    src={cover?.url}
                    alt={tr.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0 group-hover:from-black/95 transition-all duration-500" />

                  {/* Top: badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#c8892a]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(200,137,42,0.5)]">
                      Balayı
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Location + rating */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-white/55 text-xs">
                        <MapPin size={9} />
                        <span>{villa.locationDistrict}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Star size={9} className="fill-[#c8892a] text-[#c8892a]" />
                        <span className="text-xs font-bold text-white">{villa.averageRating}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-white font-bold text-lg leading-tight mb-3 group-hover:text-[#c8892a] transition-colors">
                      {tr.name}
                    </h3>

                    {/* Specs + price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/12 backdrop-blur-sm text-white/75 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bed size={9} /> {villa.bedrooms} yatak
                        </span>
                        <span className="bg-white/12 backdrop-blur-sm text-white/75 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Users size={9} /> {villa.maxGuests} kişi
                        </span>
                      </div>
                      <div>
                        <span className="text-[#c8892a] font-bold text-base">{formatPrice(villa.basePricePerNight, currency)}</span>
                        <span className="text-white/35 text-xs ml-0.5">/gece</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover ring — gold tint matching WizardCTA cards */}
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/0 group-hover:ring-[#c8892a]/35 transition-all duration-300 pointer-events-none" />
                </Link>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
