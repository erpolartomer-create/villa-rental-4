'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { amenities as allAmenities } from '@/lib/data/amenities'
import { Locale } from '@/types/villa'
import { ChevronDown } from 'lucide-react'

interface Props {
  amenityIds: string[]
}

export function VillaAmenities({ amenityIds }: Props) {
  const locale = useLocale() as Locale
  const [showAll, setShowAll] = useState(false)

  const available = allAmenities.filter(a => amenityIds.includes(a.slug))
  const displayed = showAll ? available : available.slice(0, 12)

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
      <h3 className="font-bold text-stone-800 text-lg mb-5">Özellikler ve Hizmetler</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {displayed.map(amenity => (
          <div key={amenity.id} className="flex items-center gap-2.5 text-sm text-stone-600">
            <span className="text-lg">{amenity.icon}</span>
            <span>{amenity.translations[locale]}</span>
          </div>
        ))}
      </div>

      {available.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-5 flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-700"
        >
          {showAll ? 'Daha Az Göster' : `Tüm ${available.length} özelliği gör`}
          <ChevronDown size={15} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}
