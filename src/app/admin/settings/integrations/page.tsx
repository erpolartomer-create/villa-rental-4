'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react'

type Integration = {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  fields: { key: string; label: string; type: string; placeholder: string }[]
}

const integrations: Integration[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'PostgreSQL veritabanı, kimlik doğrulama ve depolama',
    icon: '⚡',
    connected: false,
    fields: [
      { key: 'supabaseUrl', label: 'Supabase URL', type: 'text', placeholder: 'https://xxxx.supabase.co' },
      { key: 'supabaseAnonKey', label: 'Anon Key', type: 'password', placeholder: 'eyJhbGci...' },
      { key: 'supabaseServiceKey', label: 'Service Role Key', type: 'password', placeholder: 'eyJhbGci...' },
    ],
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Ziyaretçi takibi ve dönüşüm analizi',
    icon: '📊',
    connected: false,
    fields: [
      { key: 'gaId', label: 'Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
  {
    id: 'maps',
    name: 'Google Maps',
    description: 'Villa konum haritaları',
    icon: '🗺️',
    connected: false,
    fields: [
      { key: 'mapsApiKey', label: 'API Key', type: 'password', placeholder: 'AIzaSy...' },
    ],
  },
  {
    id: 'exchangerate',
    name: 'Exchange Rate API',
    description: 'Canlı döviz kurları',
    icon: '💱',
    connected: false,
    fields: [
      { key: 'exchangeApiKey', label: 'API Key', type: 'text', placeholder: 'your-api-key' },
    ],
  },
]

export default function IntegrationsPage() {
  const router = useRouter()
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({})
  const [savedIntegrations, setSavedIntegrations] = useState<string[]>([])

  const updateField = (integrationId: string, key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [integrationId]: { ...(prev[integrationId] ?? {}), [key]: value }
    }))
  }

  const saveIntegration = (id: string) => {
    setSavedIntegrations(prev => [...prev, id])
    setTimeout(() => setSavedIntegrations(prev => prev.filter(i => i !== id)), 3000)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-stone-800">Entegrasyonlar</h2>
          <p className="text-stone-400 text-sm mt-0.5">Üçüncü parti servis bağlantıları</p>
        </div>
      </div>

      {/* Demo notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-700 text-sm font-medium">Demo Modu</p>
        <p className="text-amber-600 text-sm mt-0.5">Şu an demo moddasınız. API anahtarları eklendiğinde gerçek entegrasyonlar aktif olur. Supabase bağlantısı eklediğinizde veriler otomatik olarak veritabanına geçer.</p>
      </div>

      <div className="space-y-4">
        {integrations.map(integration => {
          const isSaved = savedIntegrations.includes(integration.id)
          return (
            <div key={integration.id} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{integration.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-800">{integration.name}</h3>
                      {integration.connected && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={11} /> Bağlı
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-sm">{integration.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {integration.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-stone-600 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={configs[integration.id]?.[field.key] ?? ''}
                      onChange={e => updateField(integration.id, field.key, e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700"
                  onClick={e => e.preventDefault()}
                >
                  <ExternalLink size={12} />
                  Dokümantasyon
                </a>
                <button
                  onClick={() => saveIntegration(integration.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
                >
                  {isSaved ? <CheckCircle size={14} /> : <Save size={14} />}
                  {isSaved ? 'Kaydedildi' : 'Kaydet'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
