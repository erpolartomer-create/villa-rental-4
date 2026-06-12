import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getVillaBySlug, villas, getAvailabilityForVilla } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { VillaGallery } from '@/components/villa/VillaGallery'
import { VillaAmenities } from '@/components/villa/VillaAmenities'
import { AvailabilityCalendar } from '@/components/villa/AvailabilityCalendar'
import { BookingSidebar } from '@/components/villa/BookingSidebar'
import { VillaReviews } from '@/components/villa/VillaReviews'
import { SimilarVillas } from '@/components/villa/SimilarVillas'
import { FavoriteButton } from '@/components/villa/FavoriteButton'
import { MobileStickyBar } from '@/components/villa/MobileStickyBar'
import { Bed, Bath, Users, Ruler, Clock, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return villas.map(v => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const villa = getVillaBySlug(slug)
  if (!villa) return {}

  const tr = villa.translations[locale as Locale]
  return {
    title: tr?.seoTitle || tr?.name,
    description: tr?.seoDescription || tr?.shortDescription,
    keywords: tr?.seoKeywords,
    openGraph: {
      title: tr?.seoTitle,
      description: tr?.seoDescription,
      images: [villa.images[0]?.url],
    },
  }
}

export default async function VillaDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const villa = getVillaBySlug(slug)

  if (!villa || villa.status !== 'active') notFound()

  const t = await getTranslations({ locale, namespace: 'villa' })
  const tr = villa.translations[locale as Locale] || villa.translations.tr
  const blockedDates = getAvailabilityForVilla(villa.id)

  return (
    <div className="min-h-screen" style={{ background: '#f7f5f0' }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e3da]">
        <div className="container-villa py-3">
          <nav className="flex items-center gap-2 text-sm text-[#9b9389]">
            <Link href={`/${locale}`} className="hover:text-[#1c1712] transition-colors">Ana Sayfa</Link>
            <ChevronRight size={13} />
            <Link href={`/${locale}/villas`} className="hover:text-[#1c1712] transition-colors">Villalar</Link>
            <ChevronRight size={13} />
            <span className="text-[#1c1712] font-medium">{tr.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-villa py-6 pb-24 lg:pb-6">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1712] mb-1">{tr.name}</h1>
            <div className="flex items-center gap-2 text-[#9b9389] text-sm">
              <MapPin size={14} />
              <span>{villa.locationAddress}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {villa.categories.map(c => (
              <span key={c} className="bg-[#c8892a]/10 text-[#c8892a] border border-[#c8892a]/25 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {c}
              </span>
            ))}
            <FavoriteButton villaId={villa.id} />
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <VillaGallery images={villa.images} villaName={tr.name} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] p-6 shadow-[0_2px_16px_rgba(28,23,18,0.06)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[#f7f5f0] rounded-2xl">
                  <Bed className="w-6 h-6 text-[#c8892a] mx-auto mb-2" />
                  <div className="font-bold text-[#1c1712] text-xl">{villa.bedrooms}</div>
                  <div className="text-[#9b9389] text-xs mt-0.5">Yatak Odası</div>
                </div>
                <div className="text-center p-4 bg-[#f7f5f0] rounded-2xl">
                  <Bath className="w-6 h-6 text-[#c8892a] mx-auto mb-2" />
                  <div className="font-bold text-[#1c1712] text-xl">{villa.bathrooms}</div>
                  <div className="text-[#9b9389] text-xs mt-0.5">Banyo</div>
                </div>
                <div className="text-center p-4 bg-[#f7f5f0] rounded-2xl">
                  <Users className="w-6 h-6 text-[#c8892a] mx-auto mb-2" />
                  <div className="font-bold text-[#1c1712] text-xl">{villa.maxGuests}</div>
                  <div className="text-[#9b9389] text-xs mt-0.5">Max Misafir</div>
                </div>
                <div className="text-center p-4 bg-[#f7f5f0] rounded-2xl">
                  <Ruler className="w-6 h-6 text-[#c8892a] mx-auto mb-2" />
                  <div className="font-bold text-[#1c1712] text-xl">{villa.sizeSqm}</div>
                  <div className="text-[#9b9389] text-xs mt-0.5">m²</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] p-6 shadow-[0_2px_16px_rgba(28,23,18,0.06)]">
              <h2 className="font-bold text-[#1c1712] text-lg mb-4">Villa Hakkında</h2>
              <div className="text-[#6b6154] leading-relaxed space-y-3">
                {tr.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <VillaAmenities amenityIds={villa.amenities} />

            {/* Check-in info */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] p-6 shadow-[0_2px_16px_rgba(28,23,18,0.06)]">
              <h3 className="font-bold text-[#1c1712] text-lg mb-4">Giriş / Çıkış Bilgileri</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#c8892a] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#9b9389]">Giriş</div>
                    <div className="font-semibold text-[#1c1712]">{villa.checkinTime}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#9b9389] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#9b9389]">Çıkış</div>
                    <div className="font-semibold text-[#1c1712]">{villa.checkoutTime}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#9b9389]">Min. Konaklama</div>
                  <div className="font-semibold text-[#1c1712]">{villa.minStayNights} Gece</div>
                </div>
                <div>
                  <div className="text-xs text-[#9b9389]">Depozito</div>
                  <div className="font-semibold text-[#1c1712]">€{villa.securityDeposit}</div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] p-6 shadow-[0_2px_16px_rgba(28,23,18,0.06)]">
              <h3 className="font-bold text-[#1c1712] text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#c8892a]" />
                Konum
              </h3>
              <div className="bg-[#f0ede6] rounded-2xl h-56 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 text-[#c8892a]" />
                  <p className="text-sm text-[#6b6154]">{villa.locationAddress}</p>
                  <p className="text-xs mt-1 text-[#9b9389]">Harita görüntüleniyor...</p>
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div id="availability-calendar" className="scroll-mt-24">
              <AvailabilityCalendar blockedDates={blockedDates} villaId={villa.id} />
            </div>

            {/* Reviews */}
            <VillaReviews
              reviews={villa.reviews}
              averageRating={villa.averageRating}
              reviewCount={villa.reviewCount}
            />

            {/* Similar villas */}
            <SimilarVillas currentVillaId={villa.id} categories={villa.categories} />
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar villa={villa} />
          </div>
        </div>
      </div>
      <MobileStickyBar
        villaId={villa.id}
        basePricePerNight={villa.basePricePerNight}
        discountPercent={villa.discountPercent}
        averageRating={villa.averageRating}
        reviewCount={villa.reviewCount}
      />
    </div>
  )
}
