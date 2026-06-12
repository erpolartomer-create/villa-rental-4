'use client'
import { useState } from 'react'
import { villas } from '@/lib/data/villas'
import { Search, Grid, List, Trash2, Copy, Check } from 'lucide-react'

const allImages = villas.flatMap(v =>
  v.images.map(img => ({
    id: img.id,
    url: img.url,
    altText: img.altText,
    villaName: v.translations.tr.name,
    isCover: img.isCover,
  }))
)

export default function AdminMediaPage() {
  const [images, setImages] = useState(allImages)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = images.filter(img =>
    img.altText.toLowerCase().includes(search.toLowerCase()) ||
    img.villaName.toLowerCase().includes(search.toLowerCase())
  )

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Medya Kütüphanesi</h2>
          <p className="text-stone-400 text-sm mt-0.5">{filtered.length} görsel</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${view === 'grid' ? 'bg-sky-100 text-sky-700' : 'text-stone-400 hover:bg-stone-100'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view === 'list' ? 'bg-sky-100 text-sky-700' : 'text-stone-400 hover:bg-stone-100'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Görsel ara..."
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(img => (
            <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              {img.isCover && (
                <div className="absolute top-2 left-2 bg-sky-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  Kapak
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(img.url)}
                  className="p-2 bg-white rounded-lg text-stone-700 hover:bg-stone-100"
                  title="URL Kopyala"
                >
                  {copied === img.url ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                  className="p-2 bg-white rounded-lg text-rose-600 hover:bg-rose-50"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-stone-500 truncate">{img.altText}</p>
                <p className="text-xs text-stone-300 truncate">{img.villaName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-stone-400 border-b border-stone-100">
                <th className="px-4 py-3 font-medium">Görsel</th>
                <th className="px-4 py-3 font-medium">Alt Metin</th>
                <th className="px-4 py-3 font-medium">Villa</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(img => (
                <tr key={img.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <img src={img.url} alt={img.altText} className="w-16 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3 text-stone-600 max-w-[200px] truncate">{img.altText}</td>
                  <td className="px-4 py-3 text-stone-500 text-sm">{img.villaName}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => copyUrl(img.url)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-sky-600 hover:bg-sky-50"
                        title="URL Kopyala"
                      >
                        {copied === img.url ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                      </button>
                      <button
                        onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
