'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '@/lib/data/categories'
import { Save, ArrowLeft } from 'lucide-react'

type Locale = 'tr' | 'en' | 'ru'

export default function AdminCategoriesContentPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [activeLocale, setActiveLocale] = useState<Locale>('tr')
  const [data, setData] = useState(
    categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      icon: cat.icon,
      tr: { name: cat.translations.tr.name, description: cat.translations.tr.description },
      en: { name: cat.translations.en.name, description: cat.translations.en.description },
      ru: { name: cat.translations.ru.name, description: cat.translations.ru.description },
    }))
  )

  const locales: { key: Locale; flag: string; label: string }[] = [
    { key: 'tr', flag: '🇹🇷', label: 'Türkçe' },
    { key: 'en', flag: '🇬🇧', label: 'English' },
    { key: 'ru', flag: '🇷🇺', label: 'Русский' },
  ]

  const updateField = (catId: string, field: string, value: string) => {
    setData(prev => prev.map(c =>
      c.id === catId
        ? { ...c, [activeLocale]: { ...c[activeLocale], [field]: value } }
        : c
    ))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-stone-800">Kategori İçerikleri</h2>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
          className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
        >
          <Save size={16} />
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Locale switcher */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {locales.map(l => (
          <button
            key={l.key}
            onClick={() => setActiveLocale(l.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLocale === l.key ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <div className="font-semibold text-stone-800">{cat.slug}</div>
                <div className="text-stone-400 text-xs">{cat.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Kategori Adı</label>
                <input
                  value={cat[activeLocale].name}
                  onChange={e => updateField(cat.id, 'name', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Açıklama</label>
                <input
                  value={cat[activeLocale].description}
                  onChange={e => updateField(cat.id, 'description', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
