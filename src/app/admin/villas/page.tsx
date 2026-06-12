'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Star, Search, Filter } from 'lucide-react'
import { useVillaStore } from '@/store/villaStore'

export default function AdminVillasPage() {
  const { getVillas, deleteVilla } = useVillaStore()
  const villas = getVillas()
  const [search, setSearch] = useState('')

  const filtered = villas.filter(v =>
    v.translations.tr.name.toLowerCase().includes(search.toLowerCase()) ||
    v.locationDistrict.toLowerCase().includes(search.toLowerCase())
  )

  const statusLabels = { active: 'Aktif', inactive: 'Pasif', draft: 'Taslak' }
  const statusColors = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-stone-100 text-stone-500', draft: 'bg-amber-100 text-amber-700' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Villa Yönetimi</h2>
          <p className="text-stone-400 text-sm mt-0.5">{villas.length} villa kayıtlı</p>
        </div>
        <Link
          href="/admin/villas/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors text-sm"
        >
          <Plus size={16} />
          Yeni Villa Ekle
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400" />
        <input
          type="text"
          placeholder="Villa ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-stone-400 border-b border-stone-100">
                <th className="px-4 py-3 font-medium">Villa</th>
                <th className="px-4 py-3 font-medium">Bölge</th>
                <th className="px-4 py-3 font-medium">Detaylar</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Puan</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(villa => (
                <tr key={villa.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={villa.images[0]?.url}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-stone-700">{villa.translations.tr.name}</div>
                        <div className="text-stone-400 text-xs">{villa.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500">{villa.locationDistrict}</td>
                  <td className="px-4 py-3 text-stone-400">
                    {villa.bedrooms} yat · {villa.bathrooms} ban · {villa.maxGuests} kişi
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-700">€{villa.basePricePerNight}/gece</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium">{villa.averageRating}</span>
                      <span className="text-stone-300 text-xs">({villa.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[villa.status]}`}>
                      {statusLabels[villa.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/tr/villas/${villa.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Görüntüle"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/villas/${villa.id}`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Düzenle"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => deleteVilla(villa.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Sil"
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
      </div>
    </div>
  )
}
