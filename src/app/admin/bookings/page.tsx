'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Calendar, Eye, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'
import { useBookingsStore } from '@/store/bookingsStore'

type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

const mockBookings = [
  { id: 'B001', villa: 'Villa Azure Dream', villaId: 'v001', guest: 'Mehmet Aydın', email: 'mehmet@email.com', phone: '+90 532 111 2233', checkin: '2025-06-15', checkout: '2025-06-22', nights: 7, adults: 4, children: 0, status: 'confirmed' as BookingStatus, amount: 3150, createdAt: '2025-05-10' },
  { id: 'B002', villa: 'Villa Romantika', villaId: 'v002', guest: 'Sarah Thompson', email: 'sarah@email.com', phone: '+44 7700 900123', checkin: '2025-06-18', checkout: '2025-06-25', nights: 7, adults: 2, children: 0, status: 'pending' as BookingStatus, amount: 1960, createdAt: '2025-05-12' },
  { id: 'B003', villa: 'Villa Coral Bay', villaId: 'v003', guest: 'Dmitry Kuznetsov', email: 'dmitry@email.com', phone: '+7 916 123 4567', checkin: '2025-07-01', checkout: '2025-07-10', nights: 9, adults: 6, children: 2, status: 'confirmed' as BookingStatus, amount: 7700, createdAt: '2025-05-15' },
  { id: 'B004', villa: 'Villa Stone Palace', villaId: 'v004', guest: 'Anna Müller', email: 'anna@email.com', phone: '+49 171 2345678', checkin: '2025-07-05', checkout: '2025-07-12', nights: 7, adults: 3, children: 1, status: 'pending' as BookingStatus, amount: 4060, createdAt: '2025-05-18' },
  { id: 'B005', villa: 'Villa Turquoise Palace', villaId: 'v005', guest: 'James Taylor', email: 'james@email.com', phone: '+1 555 234 5678', checkin: '2025-08-01', checkout: '2025-08-14', nights: 13, adults: 8, children: 2, status: 'confirmed' as BookingStatus, amount: 16800, createdAt: '2025-05-20' },
  { id: 'B006', villa: 'Villa Olive Grove', villaId: 'v006', guest: 'Fatma Kaya', email: 'fatma@email.com', phone: '+90 533 444 5566', checkin: '2025-05-20', checkout: '2025-05-25', nights: 5, adults: 2, children: 0, status: 'completed' as BookingStatus, amount: 1750, createdAt: '2025-04-30' },
  { id: 'B007', villa: 'Villa Sunset Paradise', villaId: 'v007', guest: 'Marco Rossi', email: 'marco@email.com', phone: '+39 333 1234567', checkin: '2025-06-10', checkout: '2025-06-17', nights: 7, adults: 4, children: 1, status: 'cancelled' as BookingStatus, amount: 3500, createdAt: '2025-05-01' },
  { id: 'B008', villa: 'Villa Azure Dream', villaId: 'v001', guest: 'Li Wei', email: 'liwei@email.com', phone: '+86 138 0013 8000', checkin: '2025-09-05', checkout: '2025-09-12', nights: 7, adults: 2, children: 0, status: 'pending' as BookingStatus, amount: 4550, createdAt: '2025-05-22' },
]

const statusConfig = {
  confirmed: { label: 'Onaylı', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  pending: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700', icon: Clock },
  cancelled: { label: 'İptal', color: 'bg-rose-100 text-rose-700', icon: XCircle },
  completed: { label: 'Tamamlandı', color: 'bg-sky-100 text-sky-700', icon: CheckCircle },
}

export default function AdminBookingsPage() {
  const { bookings: storeBookings, updateBookingStatus } = useBookingsStore()
  const [localMock, setLocalMock] = useState(mockBookings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Convert store bookings to display format and merge with mock
  const storeDisplay = storeBookings.map(b => ({
    id: b.id,
    villa: b.villaName,
    villaId: b.villaId,
    guest: b.guestName,
    email: b.guestEmail,
    phone: b.guestPhone,
    checkin: b.checkinDate,
    checkout: b.checkoutDate,
    nights: b.nights,
    adults: b.adults,
    children: b.children,
    status: b.status as BookingStatus,
    amount: b.totalPrice,
    createdAt: b.createdAt,
  }))

  const allBookings = [...storeDisplay, ...localMock]

  const filtered = allBookings.filter(b => {
    const matchSearch = b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.villa.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0)

  const updateStatus = (id: string, status: BookingStatus) => {
    // Update in real store if it exists there, otherwise update local mock
    if (storeBookings.some(b => b.id === id)) {
      updateBookingStatus(id, status)
    } else {
      setLocalMock(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Rezervasyonlar</h2>
          <p className="text-stone-400 text-sm mt-0.5">{filtered.length} rezervasyon · Toplam €{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(['confirmed', 'pending', 'completed', 'cancelled'] as BookingStatus[]).map(s => {
          const count = allBookings.filter(b => b.status === s).length
          const cfg = statusConfig[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`bg-white rounded-xl border p-4 text-left transition-colors ${statusFilter === s ? 'border-sky-400 ring-1 ring-sky-400' : 'border-stone-100 hover:border-stone-200'}`}
            >
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${cfg.color}`}>
                {cfg.label}
              </div>
              <div className="text-2xl font-bold text-stone-800">{count}</div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Misafir adı, villa veya rezervasyon no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium whitespace-nowrap"
          >
            Filtreyi Temizle
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-stone-400 border-b border-stone-100">
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Villa</th>
                <th className="px-4 py-3 font-medium">Misafir</th>
                <th className="px-4 py-3 font-medium">Tarihler</th>
                <th className="px-4 py-3 font-medium">Kişi</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Tutar</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(b => {
                const cfg = statusConfig[b.status]
                return (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{b.id}</td>
                    <td className="px-4 py-3 font-medium text-stone-700 max-w-[140px] truncate">{b.villa}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-700">{b.guest}</div>
                      <div className="text-stone-400 text-xs">{b.email}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar size={12} />
                        {b.checkin}
                      </div>
                      <div className="text-stone-300 text-xs pl-4">→ {b.checkout} ({b.nights}g)</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {b.adults}y {b.children > 0 ? `· ${b.children}ç` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative group">
                        <button className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                          {cfg.label}
                          <ChevronDown size={11} />
                        </button>
                        <div className="absolute left-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-10 min-w-[140px] hidden group-hover:block">
                          {(Object.keys(statusConfig) as BookingStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(b.id, s)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 first:rounded-t-xl last:rounded-b-xl ${b.status === s ? 'font-bold' : ''}`}
                            >
                              {statusConfig[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-700">€{b.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/bookings/${b.id}`}
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
