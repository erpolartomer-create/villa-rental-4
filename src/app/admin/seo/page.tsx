'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Save, Globe, Search, Code, FileText, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react'

type Locale = 'tr' | 'en' | 'ru'

const locales: { key: Locale; flag: string; label: string }[] = [
  { key: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { key: 'en', flag: '🇬🇧', label: 'English' },
  { key: 'ru', flag: '🇷🇺', label: 'Русский' },
]

const defaultSeo = {
  tr: {
    siteTitle: 'Kaş & Kalkan Villa Kiralama | Lüks Tatil Villaları',
    siteDescription: 'Kaş ve Kalkan\'ın en lüks villa kiralama platformu. Deniz manzaralı, özel havuzlu, balayı ve aile villaları ile unutulmaz bir tatil sizi bekliyor.',
    siteKeywords: 'kaş villa kiralama, kalkan villa kiralama, lüks villa türkiye, deniz manzaralı villa, balayı villası kaş',
    ogTitle: 'Kaş & Kalkan\'ın En Güzel Villaları',
    ogDescription: '200\'den fazla lüks villa, 5000\'den fazla mutlu misafir. Hayalinizdeki tatili planlayın.',
    ogImage: '/images/cat_luxury.png',
    twitterCard: 'summary_large_image',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleSearchConsole: '',
    schemaOrg: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kaş & Kalkan Villalar",
  "url": "https://kaskalkan.com",
  "logo": "https://kaskalkan.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-532-123-4567",
    "contactType": "customer service"
  }
}`,
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://kaskalkan.com/sitemap.xml`,
  },
  en: {
    siteTitle: 'Kaş & Kalkan Villa Rental | Luxury Holiday Villas',
    siteDescription: 'Discover the finest villa rentals in Kaş and Kalkan. Sea view, private pool, honeymoon and family villas for an unforgettable holiday in Turkey.',
    siteKeywords: 'kas villa rental, kalkan villa rental, luxury villa turkey, sea view villa, honeymoon villa kas',
    ogTitle: 'The Most Beautiful Villas in Kaş & Kalkan',
    ogDescription: '200+ luxury villas, 5000+ happy guests. Plan your dream holiday.',
    ogImage: '/images/cat_luxury.png',
    twitterCard: 'summary_large_image',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleSearchConsole: '',
    schemaOrg: '',
    robotsTxt: '',
  },
  ru: {
    siteTitle: 'Аренда Вилл в Каш и Калкан | Виллы для Отдыха',
    siteDescription: 'Лучший сервис аренды вилл в Каш и Калкан. Виллы с видом на море, частным бассейном, для медового месяца и семейного отдыха.',
    siteKeywords: 'аренда виллы каш, аренда виллы калкан, люкс вилла турция, вилла с видом на море',
    ogTitle: 'Лучшие Виллы в Каш и Калкан',
    ogDescription: '200+ роскошных вилл, 5000+ довольных гостей. Спланируйте отдых своей мечты.',
    ogImage: '/images/cat_luxury.png',
    twitterCard: 'summary_large_image',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleSearchConsole: '',
    schemaOrg: '',
    robotsTxt: '',
  },
}

export default function SeoPage() {
  const [activeLocale, setActiveLocale] = useState<Locale>('tr')
  const [activeSection, setActiveSection] = useState('meta')
  const [saved, setSaved] = useState(false)
  const [seo, setSeo] = useState(defaultSeo)

  const current = seo[activeLocale]
  const update = (field: string, value: string) => {
    setSeo(prev => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value }
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const charLimit = (text: string, min: number, max: number) => {
    const len = text.length
    if (len === 0) return null
    if (len < min) return { ok: false, msg: `${len}/${max} karakter (min. ${min})` }
    if (len > max) return { ok: false, msg: `${len}/${max} karakter (çok uzun!)` }
    return { ok: true, msg: `${len}/${max} karakter` }
  }

  const TitleCheck = ({ text, min, max }: { text: string; min: number; max: number }) => {
    const c = charLimit(text, min, max)
    if (!c) return null
    return (
      <span className={`text-xs ${c.ok ? 'text-emerald-600' : 'text-amber-600'} flex items-center gap-1 mt-1`}>
        {c.ok ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
        {c.msg}
      </span>
    )
  }

  const Field = ({ label, field, placeholder, multiline = false, rows = 3, min = 0, max = 999 }: {
    label: string; field: string; placeholder?: string; multiline?: boolean; rows?: number; min?: number; max?: number
  }) => {
    const val = (current as Record<string, string>)[field] ?? ''
    return (
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
        {multiline ? (
          <textarea
            value={val}
            onChange={e => update(field, e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none font-mono"
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={e => update(field, e.target.value)}
            placeholder={placeholder}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
          />
        )}
        <TitleCheck text={val} min={min} max={max} />
      </div>
    )
  }

  const sections = [
    { id: 'meta', label: 'Meta Etiketler', icon: Search },
    { id: 'og', label: 'Open Graph', icon: Globe },
    { id: 'schema', label: 'Schema.org', icon: Code },
    { id: 'technical', label: 'Teknik SEO', icon: FileText },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">SEO Yönetimi</h2>
          <p className="text-stone-400 text-sm mt-0.5">Site geneli meta etiketler ve teknik SEO ayarları</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/seo/pages"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors text-sm"
          >
            Sayfa Bazlı SEO
            <ChevronRight size={14} />
          </Link>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-colors text-sm ${
              saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            <Save size={16} />
            {saved ? 'Kaydedildi!' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* SEO Score card */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-sky-200 mb-1">SEO Skoru</div>
            <div className="text-4xl font-bold">87/100</div>
            <div className="text-sky-200 text-sm mt-1">İyi · 3 öneri var</div>
          </div>
          <div className="space-y-2 text-sm text-sky-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-300" /> Meta açıklamalar ekli</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-300" /> Sitemap.xml hazır</div>
            <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-300" /> Schema.org tüm villas için eksik</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar */}
        <div className="w-52 shrink-0 space-y-1">
          {/* Locale switcher */}
          <div className="bg-white rounded-xl border border-stone-100 p-2 mb-3">
            {locales.map(l => (
              <button
                key={l.key}
                onClick={() => setActiveLocale(l.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeLocale === l.key ? 'bg-sky-50 text-sky-700 font-medium' : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                <span>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>

          {/* Sections */}
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeSection === s.id ? 'bg-white border border-stone-100 text-sky-700 font-medium shadow-sm' : 'text-stone-500 hover:bg-white'
              }`}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            {/* Locale label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">{locales.find(l => l.key === activeLocale)?.flag}</span>
              <span className="font-bold text-stone-800">{locales.find(l => l.key === activeLocale)?.label}</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 text-sm">{sections.find(s => s.id === activeSection)?.label}</span>
            </div>

            {activeSection === 'meta' && (
              <div className="space-y-5">
                <Field
                  label="Site Başlığı (Title Tag)"
                  field="siteTitle"
                  placeholder="Ana sayfa title etiketi"
                  min={30}
                  max={60}
                />
                <Field
                  label="Meta Açıklama"
                  field="siteDescription"
                  placeholder="Arama motorlarında görünen açıklama"
                  multiline
                  rows={3}
                  min={120}
                  max={160}
                />
                <Field
                  label="Anahtar Kelimeler"
                  field="siteKeywords"
                  placeholder="kelime1, kelime2, kelime3"
                />
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-wide">Önizleme (Google)</div>
                  <div className="max-w-lg">
                    <div className="text-sky-700 text-sm font-medium truncate">{current.siteTitle || 'Site Başlığı'}</div>
                    <div className="text-green-700 text-xs mb-1">kaskalkan.com</div>
                    <div className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                      {current.siteDescription || 'Meta açıklama buraya gelir...'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'og' && (
              <div className="space-y-5">
                <Field label="OG Başlık" field="ogTitle" placeholder="Sosyal medyada görünen başlık" />
                <Field label="OG Açıklama" field="ogDescription" multiline rows={3} placeholder="Sosyal medyada görünen açıklama" />
                <Field label="OG Görsel URL" field="ogImage" placeholder="https://..." />
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Twitter Card Tipi</label>
                  <select
                    value={current.twitterCard}
                    onChange={e => update('twitterCard', e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                  >
                    <option value="summary_large_image">summary_large_image (Büyük görsel)</option>
                    <option value="summary">summary (Küçük görsel)</option>
                  </select>
                </div>
                {current.ogImage && (
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-wide">Önizleme</div>
                    <div className="max-w-sm border border-stone-200 rounded-xl overflow-hidden">
                      <img src={current.ogImage} alt="OG Preview" className="w-full h-36 object-cover" />
                      <div className="p-3">
                        <div className="text-xs text-stone-400 mb-1">kaskalkan.com</div>
                        <div className="font-semibold text-stone-800 text-sm">{current.ogTitle}</div>
                        <div className="text-stone-500 text-xs mt-1 line-clamp-2">{current.ogDescription}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'schema' && (
              <div className="space-y-5">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700">
                  <p className="font-medium mb-1">Schema.org JSON-LD</p>
                  <p className="text-sky-600">Arama motorlarına yapılandırılmış veri sağlar. Organization, LodgingBusiness ve BreadcrumbList şemaları ekleyebilirsiniz.</p>
                </div>
                <Field
                  label="Organization Schema"
                  field="schemaOrg"
                  multiline
                  rows={12}
                  placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                />
                <div className="flex gap-2">
                  <button className="text-sm text-sky-600 hover:text-sky-700 font-medium px-3 py-1.5 border border-sky-200 rounded-lg">
                    Organization Şablonu
                  </button>
                  <button className="text-sm text-sky-600 hover:text-sky-700 font-medium px-3 py-1.5 border border-sky-200 rounded-lg">
                    LodgingBusiness Şablonu
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'technical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 mb-1.5">Google Analytics ID</label>
                    <input
                      type="text"
                      value={current.googleAnalytics}
                      onChange={e => update('googleAnalytics', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 mb-1.5">Google Search Console</label>
                    <input
                      type="text"
                      value={current.googleSearchConsole}
                      onChange={e => update('googleSearchConsole', e.target.value)}
                      placeholder="Doğrulama kodu"
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <Field
                  label="Robots.txt"
                  field="robotsTxt"
                  multiline
                  rows={8}
                  placeholder="User-agent: *&#10;Allow: /"
                />

                <div className="bg-stone-50 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-semibold text-stone-700">Sitemap</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-stone-600">sitemap.xml</div>
                      <div className="text-xs text-stone-400">15 villa, 3 dil, 45 blog yazısı</div>
                    </div>
                    <div className="flex gap-2">
                      <a href="/sitemap.xml" target="_blank" className="text-xs text-sky-600 hover:text-sky-700 px-3 py-1.5 border border-sky-200 rounded-lg">
                        Görüntüle
                      </a>
                      <button className="text-xs bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded-lg">
                        Yeniden Oluştur
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
