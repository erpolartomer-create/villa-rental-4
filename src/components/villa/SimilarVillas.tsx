import { useLocale } from 'next-intl'
import { villas } from '@/lib/data/villas'
import { VillaCard } from './VillaCard'

interface Props {
  currentVillaId: string
  categories: string[]
}

export function SimilarVillas({ currentVillaId, categories }: Props) {
  const locale = useLocale()

  const similar = villas
    .filter(v => v.id !== currentVillaId && v.status === 'active')
    .filter(v => v.categories.some(c => categories.includes(c)))
    .slice(0, 3)

  if (similar.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
      <h3 className="font-bold text-stone-800 text-lg mb-5">Benzer Villalar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {similar.map(villa => (
          <VillaCard key={villa.id} villa={villa} compact />
        ))}
      </div>
    </div>
  )
}
