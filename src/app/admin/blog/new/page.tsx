'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'

const tabs = ['Genel', 'İçerik (TR)', 'İçerik (EN)', 'İçerik (RU)']

export default function NewBlogPostPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState({
    slug: '',
    coverImage: '',
    status: 'draft',
    titleTR: '', excerptTR: '', contentTR: '',
    titleEN: '', excerptEN: '', contentEN: '',
    titleRU: '', excerptRU: '', contentRU: '',
  })

  const Input = ({ label, field, placeholder }: { label: string; field: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
      <input
        value={(form as Record<string, string>)[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
      />
    </div>
  )

  const Textarea = ({ label, field, rows = 4 }: { label: string; field: string; rows?: number }) => (
    <div>
      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
      <textarea
        value={(form as Record<string, string>)[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        rows={rows}
        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-stone-800">Yeni Blog Yazısı</h2>
        </div>
        <button
          onClick={() => { alert('Yazı kaydedildi! (Demo)'); router.push('/admin/blog') }}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 text-sm"
        >
          <Save size={16} />
          Yayınla
        </button>
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === i ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        {activeTab === 0 && (
          <div className="space-y-4">
            <Input label="URL Slug" field="slug" placeholder="guzel-bir-yazi-basligi" />
            <Input label="Kapak Görseli URL" field="coverImage" placeholder="https://images.unsplash.com/..." />
            {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-48 rounded-xl object-cover" />}
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Durum</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-48 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>
          </div>
        )}
        {[1, 2, 3].includes(activeTab) && (() => {
          const langs = [['TR', 'titleTR', 'excerptTR', 'contentTR'], ['EN', 'titleEN', 'excerptEN', 'contentEN'], ['RU', 'titleRU', 'excerptRU', 'contentRU']]
          const [lang, titleF, excerptF, contentF] = langs[activeTab - 1]
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded">
                  {lang === 'TR' ? '🇹🇷' : lang === 'EN' ? '🇬🇧' : '🇷🇺'} {lang}
                </span>
              </div>
              <Input label="Başlık" field={titleF} />
              <Textarea label="Özet" field={excerptF} rows={2} />
              <Textarea label="İçerik" field={contentF} rows={14} />
            </div>
          )
        })()}
      </div>
    </div>
  )
}
