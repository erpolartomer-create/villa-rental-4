'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Save, ChevronRight } from 'lucide-react'
import { villas } from '@/lib/data/villas'

type Locale = 'tr' | 'en' | 'ru'

const initialContent = {
  hero: {
    tr: { title: 'Kaş & Kalkan\'ın En Güzel Villaları', subtitle: 'Türkiye\'nin en gözde tatil köşelerinde sizi bekleyen lüks villalar', ctaText: 'Villalara Göz At', backgroundImage: '/images/hero_bg.png' },
    en: { title: 'The Most Beautiful Villas in Kaş & Kalkan', subtitle: 'Luxury villas awaiting you in Turkey\'s most sought-after holiday destinations', ctaText: 'Browse Villas', backgroundImage: '' },
    ru: { title: 'Лучшие Виллы в Каш и Калкан', subtitle: 'Роскошные виллы в самых популярных туристических местах Турции', ctaText: 'Посмотреть Виллы', backgroundImage: '' },
  },
  stats: { villas: '200+', guests: '5000+', years: '10' },
  regionTitle: {
    tr: 'Kaş & Kalkan\'ı Keşfedin',
    en: 'Discover Kaş & Kalkan',
    ru: 'Откройте для себя Каш и Калкан',
  },
}

export default function AdminContentPage() {
  const [content, setContent] = useState(initialContent)
  const [activeLocale, setActiveLocale] = useState<Locale>('tr')
  const [activeSection, setActiveSection] = useState('hero')
  const [saved, setSaved] = useState(false)
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    villas.filter(v => v.isFeatured).map(v => v.id)
  )

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const locales: { key: Locale; flag: string; label: string }[] = [
    { key: 'tr', flag: '🇹🇷', label: 'TR' },
    { key: 'en', flag: '🇬🇧', label: 'EN' },
    { key: 'ru', flag: '🇷🇺', label: 'RU' },
  ]

  const sections = [
    { id: 'hero', label: 'Hero Bölümü' },
    { id: 'stats', label: 'İstatistikler' },
    { id: 'featured', label: 'Öne Çıkan Villalar' },
    { id: 'region', label: 'Bölge Tanıtımı' },
  ]

  const updateHero = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [activeLocale]: { ...prev.hero[activeLocale], [field]: value }
      }
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">İçerik Yönetimi</h2>
          <p className="text-stone-400 text-sm mt-0.5">Ana sayfa içerikleri ve öne çıkan villalar</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/content/categories"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 text-sm"
          >
            Kategoriler
            <ChevronRight size={14} />
          </Link>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
          >
            <Save size={16} />
            {saved ? 'Kaydedildi!' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-stone-100 p-2 mb-3">
            {locales.map(l => (
              <button
                key={l.key}
                onClick={() => setActiveLocale(l.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeLocale === l.key ? 'bg-sky-50 text-sky-700 font-medium' : 'text-stone-500 hover:bg-stone-50'}`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${activeSection === s.id ? 'bg-white border border-stone-100 text-sky-700 font-medium shadow-sm' : 'text-stone-500 hover:bg-white'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            {activeSection === 'hero' && (
              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 mb-4">Hero Bölümü · {locales.find(l => l.key === activeLocale)?.flag}</h3>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Ana Başlık</label>
                  <input
                    value={content.hero[activeLocale].title}
                    onChange={e => updateHero('title', e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Alt Başlık</label>
                  <textarea
                    value={content.hero[activeLocale].subtitle}
                    onChange={e => updateHero('subtitle', e.target.value)}
                    rows={2}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Buton Metni</label>
                  <input
                    value={content.hero[activeLocale].ctaText}
                    onChange={e => updateHero('ctaText', e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
                {activeLocale === 'tr' && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 mb-1.5">Arka Plan Görseli URL</label>
                    <input
                      value={content.hero.tr.backgroundImage}
                      onChange={e => updateHero('backgroundImage', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                    />
                    {content.hero.tr.backgroundImage && (
                      <img src={content.hero.tr.backgroundImage} alt="" className="mt-2 w-full h-32 rounded-xl object-cover" />
                    )}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'stats' && (
              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 mb-4">İstatistik Sayaçları</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[['villas', 'Villa Sayısı'], ['guests', 'Misafir Sayısı'], ['years', 'Yıl Deneyimi']].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
                      <input
                        value={(content.stats as Record<string, string>)[field]}
                        onChange={e => setContent(prev => ({ ...prev, stats: { ...prev.stats, [field]: e.target.value } }))}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'featured' && (
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Öne Çıkan Villalar</h3>
                <p className="text-stone-400 text-sm mb-5">Ana sayfada gösterilecek villaları seçin</p>
                <div className="space-y-2">
                  {villas.map(v => (
                    <label key={v.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={featuredIds.includes(v.id)}
                        onChange={e => setFeaturedIds(prev =>
                          e.target.checked ? [...prev, v.id] : prev.filter(id => id !== v.id)
                        )}
                        className="w-4 h-4 rounded text-sky-600"
                      />
                      <img src={v.images[0]?.url} alt="" className="w-10 h-8 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-stone-700 text-sm">{v.translations.tr.name}</div>
                        <div className="text-stone-400 text-xs">{v.locationDistrict}</div>
                      </div>
                      <span className="text-xs text-stone-400">€{v.basePricePerNight}/gece</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'region' && (
              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 mb-4">Bölge Tanıtımı · {locales.find(l => l.key === activeLocale)?.flag}</h3>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Bölüm Başlığı</label>
                  <input
                    value={content.regionTitle[activeLocale]}
                    onChange={e => setContent(prev => ({
                      ...prev,
                      regionTitle: { ...prev.regionTitle, [activeLocale]: e.target.value }
                    }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
