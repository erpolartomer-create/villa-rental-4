'use client'
import { villas } from '@/lib/data/villas'
import { TrendingUp, Home, Calendar, Users, Star, DollarSign, Eye, ArrowUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Link from 'next/link'

const mockBookings = [
  { id: 'B001', villa: 'Villa Azure Dream', guest: 'Mehmet A.', checkin: '2025-06-15', checkout: '2025-06-22', status: 'confirmed', amount: 3150 },
  { id: 'B002', villa: 'Villa Romantika', guest: 'Sarah T.', checkin: '2025-06-18', checkout: '2025-06-25', status: 'pending', amount: 1960 },
  { id: 'B003', villa: 'Villa Coral Bay', guest: 'Dmitry K.', checkin: '2025-07-01', checkout: '2025-07-10', status: 'confirmed', amount: 7700 },
  { id: 'B004', villa: 'Villa Stone Palace', guest: 'Anna M.', checkin: '2025-07-05', checkout: '2025-07-12', status: 'pending', amount: 4060 },
  { id: 'B005', villa: 'Villa Turquoise Palace', guest: 'James T.', checkin: '2025-08-01', checkout: '2025-08-14', status: 'confirmed', amount: 16800 },
]

const revenueData = [
  { month: 'Oca', revenue: 12400 },
  { month: 'Şub', revenue: 15200 },
  { month: 'Mar', revenue: 18900 },
  { month: 'Nis', revenue: 24500 },
  { month: 'May', revenue: 32000 },
  { month: 'Haz', revenue: 48500 },
  { month: 'Tem', revenue: 72000 },
  { month: 'Ağu', revenue: 89500 },
  { month: 'Eyl', revenue: 54000 },
  { month: 'Eki', revenue: 31000 },
  { month: 'Kas', revenue: 19000 },
  { month: 'Ara', revenue: 22000 },
]

const statusColors = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-sky-100 text-sky-700',
}

function StatCard({ title, value, change, icon: Icon, color }: { title: string; value: string; change: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
          <ArrowUp size={13} />
          <span>{change}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-stone-800 mb-0.5">{value}</div>
      <div className="text-stone-400 text-sm">{title}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const activeVillas = villas.filter(v => v.status === 'active').length
  const totalViews = villas.reduce((s, v) => s + v.viewCount, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Aktif Villa" value={activeVillas.toString()} change="8%" icon={Home} color="bg-sky-100 text-sky-600" />
        <StatCard title="Bu Ay Rezervasyon" value="47" change="12%" icon={Calendar} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Aylık Gelir" value="€32,450" change="23%" icon={DollarSign} color="bg-amber-100 text-amber-600" />
        <StatCard title="Toplam Görüntülenme" value={totalViews.toLocaleString()} change="18%" icon={Eye} color="bg-purple-100 text-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">2025 Yıllık Gelir (EUR)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [`€${Number(v).toLocaleString()}`, 'Gelir']} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Doluluk Oranı (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { month: 'Oca', rate: 45 }, { month: 'Şub', rate: 52 }, { month: 'Mar', rate: 61 },
              { month: 'Nis', rate: 68 }, { month: 'May', rate: 75 }, { month: 'Haz', rate: 88 },
              { month: 'Tem', rate: 96 }, { month: 'Ağu', rate: 98 }, { month: 'Eyl', rate: 82 },
              { month: 'Eki', rate: 65 }, { month: 'Kas', rate: 48 }, { month: 'Ara', rate: 55 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: unknown) => [`${v}%`, 'Doluluk']} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-stone-800">Son Rezervasyonlar</h3>
          <Link href="/admin/bookings" className="text-sky-600 text-sm hover:text-sky-700">Tümünü Gör</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-400 border-b border-stone-100">
                <th className="pb-3 font-medium">Ref</th>
                <th className="pb-3 font-medium">Villa</th>
                <th className="pb-3 font-medium">Misafir</th>
                <th className="pb-3 font-medium">Tarihler</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {mockBookings.map(b => (
                <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 font-mono text-xs text-stone-400">{b.id}</td>
                  <td className="py-3 font-medium text-stone-700">{b.villa}</td>
                  <td className="py-3 text-stone-500">{b.guest}</td>
                  <td className="py-3 text-stone-500 text-xs">{b.checkin} → {b.checkout}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status as keyof typeof statusColors]}`}>
                      {b.status === 'confirmed' ? 'Onaylı' : b.status === 'pending' ? 'Beklemede' : b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-stone-700">€{b.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Villas */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-stone-800">En Popüler Villalar</h3>
          <Link href="/admin/villas" className="text-sky-600 text-sm hover:text-sky-700">Tümünü Gör</Link>
        </div>
        <div className="space-y-3">
          {villas.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5).map((villa, i) => (
            <div key={villa.id} className="flex items-center gap-3">
              <span className="text-stone-300 font-bold w-5 text-sm">{i + 1}</span>
              <img src={villa.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-700 text-sm truncate">{villa.translations.tr.name}</div>
                <div className="text-stone-400 text-xs">{villa.locationDistrict}</div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="font-medium">{villa.averageRating}</span>
              </div>
              <div className="text-stone-400 text-xs flex items-center gap-1">
                <Eye size={12} />
                {villa.viewCount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
