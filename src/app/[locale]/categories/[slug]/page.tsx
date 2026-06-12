import { notFound } from 'next/navigation'
import { categories } from '@/lib/data/categories'
import { getVillasByCategory } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { VillaCard } from '@/components/villa/VillaCard'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }))
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params
  const category = categories.find(c => c.slug === slug)
  if (!category) notFound()

  const villas = getVillasByCategory(slug)
  const tr = category.translations[locale as Locale] || category.translations.tr

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-sky-800 to-blue-900 text-white py-16 pt-28">
        <div className="container-villa text-center">
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold mb-3">{tr.name}</h1>
          <p className="text-sky-200 max-w-xl mx-auto">{tr.description}</p>
          <div className="mt-4 text-sky-300">{villas.length} villa bulundu</div>
        </div>
      </div>

      <div className="container-villa py-12">
        {villas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400">Bu kategoride henüz villa bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {villas.map(villa => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
