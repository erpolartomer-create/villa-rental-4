'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Mail, Phone, Flag } from 'lucide-react'

const mockCustomers = [
  { id: 'C001', name: 'Mehmet Aydın', email: 'mehmet@email.com', phone: '+90 532 111 2233', nationality: 'TR', bookings: 3, totalSpent: 8200, lastBooking: '2025-06-15', status: 'vip' },
  { id: 'C002', name: 'Sarah Thompson', email: 'sarah@email.com', phone: '+44 7700 900123', nationality: 'GB', bookings: 1, totalSpent: 1960, lastBooking: '2025-06-18', status: 'regular' },
  { id: 'C003', name: 'Dmitry Kuznetsov', email: 'dmitry@email.com', phone: '+7 916 123 4567', nationality: 'RU', bookings: 5, totalSpent: 28400, lastBooking: '2025-07-01', status: 'vip' },
  { id: 'C004', name: 'Anna Müller', email: 'anna@email.com', phone: '+49 171 2345678', nationality: 'DE', bookings: 2, totalSpent: 6800, lastBooking: '2025-07-05', status: 'regular' },
  { id: 'C005', name: 'James Taylor', email: 'james@email.com', phone: '+1 555 234 5678', nationality: 'US', bookings: 1, totalSpent: 16800, lastBooking: '2025-08-01', status: 'vip' },
  { id: 'C006', name: 'Fatma Kaya', email: 'fatma@email.com', phone: '+90 533 444 5566', nationality: 'TR', bookings: 4, totalSpent: 9200, lastBooking: '2025-05-20', status: 'regular' },
  { id: 'C007', name: 'Marco Rossi', email: 'marco@email.com', phone: '+39 333 1234567', nationality: 'IT', bookings: 1, totalSpent: 0, lastBooking: '2025-06-10', status: 'cancelled' },
  { id: 'C008', name: 'Li Wei', email: 'liwei@email.com', phone: '+86 138 0013 8000', nationality: 'CN', bookings: 1, totalSpent: 4550, lastBooking: '2025-09-05', status: 'new' },
]

const statusConfig = {
  vip: { label: 'VIP', color: 'bg-amber-100 text-amber-700' },
  regular: { label: 'Düzenli', color: 'bg-sky-100 text-sky-700' },
  new: { label: 'Yeni', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'İptal', color: 'bg-stone-100 text-stone-500' },
}

const flagEmoji: Record<string, string> = {
  TR: '🇹🇷', GB: '🇬🇧', RU: '🇷🇺', DE: '🇩🇪', US: '🇺🇸', IT: '🇮🇹', CN: '🇨🇳'
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Müşteriler</h2>
          <p className="text-stone-400 text-sm mt-0.5">{mockCustomers.length} kayıtlı müşteri</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="İsim veya e-posta ara..."
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-stone-400 border-b border-stone-100">
                <th className="px-4 py-3 font-medium">Müşteri</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium">Uyruk</th>
                <th className="px-4 py-3 font-medium">Rezervasyon</th>
                <th className="px-4 py-3 font-medium">Toplam Harcama</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(c => {
                const cfg = statusConfig[c.status as keyof typeof statusConfig]
                return (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold text-sm shrink-0">
                          {c.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-stone-700">{c.name}</div>
                          <div className="text-stone-400 text-xs">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-stone-500 mb-0.5">
                        <Mail size={11} /> {c.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-400">
                        <Phone size={11} /> {c.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-lg">{flagEmoji[c.nationality] ?? c.nationality}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-700">{c.bookings}</div>
                      <div className="text-stone-400 text-xs">Son: {c.lastBooking}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-700">€{c.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
