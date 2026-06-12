'use client'
import { villas } from '@/lib/data/villas'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react'

const revenueData = [
  { month: 'Oca', revenue: 12400, bookings: 8 },
  { month: 'Şub', revenue: 15200, bookings: 11 },
  { month: 'Mar', revenue: 18900, bookings: 14 },
  { month: 'Nis', revenue: 24500, bookings: 18 },
  { month: 'May', revenue: 32000, bookings: 24 },
  { month: 'Haz', revenue: 48500, bookings: 35 },
  { month: 'Tem', revenue: 72000, bookings: 52 },
  { month: 'Ağu', revenue: 89500, bookings: 64 },
  { month: 'Eyl', revenue: 54000, bookings: 38 },
  { month: 'Eki', revenue: 31000, bookings: 22 },
  { month: 'Kas', revenue: 19000, bookings: 14 },
  { month: 'Ara', revenue: 22000, bookings: 16 },
]

const trafficData = [
  { day: 'Pzt', visits: 420 }, { day: 'Sal', visits: 380 }, { day: 'Çar', visits: 510 },
  { day: 'Per', visits: 470 }, { day: 'Cum', visits: 640 }, { day: 'Cmt', visits: 820 }, { day: 'Paz', visits: 750 },
]

const sourceData = [
  { name: 'Organik', value: 42, color: '#0ea5e9' },
  { name: 'Direkt', value: 28, color: '#10b981' },
  { name: 'Sosyal Medya', value: 18, color: '#f59e0b' },
  { name: 'Referral', value: 12, color: '#8b5cf6' },
]

const topVillas = villas.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

export default function AdminAnalyticsPage() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalBookings = revenueData.reduce((s, d) => s + d.bookings, 0)
  const totalViews = villas.reduce((s, v) => s + v.viewCount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-800">Analitik</h2>
        <p className="text-stone-400 text-sm mt-0.5">2025 yılı performans verileri</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Yıllık Gelir', value: `€${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: 'bg-sky-100 text-sky-600', change: '+23%' },
          { label: 'Toplam Rezervasyon', value: totalBookings.toString(), icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600', change: '+18%' },
          { label: 'Toplam Görüntülenme', value: totalViews.toLocaleString(), icon: Eye, color: 'bg-purple-100 text-purple-600', change: '+31%' },
          { label: 'Doluluk Oranı', value: '%74', icon: Users, color: 'bg-amber-100 text-amber-600', change: '+5%' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center`}>
                <m.icon size={18} />
              </div>
              <span className="text-xs font-medium text-emerald-600">{m.change}</span>
            </div>
            <div className="text-2xl font-bold text-stone-800">{m.value}</div>
            <div className="text-stone-400 text-sm mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Aylık Gelir (EUR)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [`€${Number(v).toLocaleString()}`, 'Gelir']} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly traffic */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Haftalık Ziyaretçi</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic sources */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Trafik Kaynakları</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 shrink-0">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-stone-600">{s.name}</span>
                  <span className="text-sm font-semibold text-stone-800 ml-1">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top villas by views */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-4">En Çok Görüntülenen Villalar</h3>
          <div className="space-y-3">
            {topVillas.map((v, i) => {
              const pct = Math.round((v.viewCount / topVillas[0].viewCount) * 100)
              return (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="text-stone-300 font-bold text-sm w-4">{i + 1}</span>
                  <img src={v.images[0]?.url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-700 truncate mb-1">{v.translations.tr.name}</div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{v.viewCount.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
