'use client'
import { useState } from 'react'
import { villas } from '@/lib/data/villas'
import { Star, CheckCircle, XCircle, Search, MessageSquare } from 'lucide-react'

type Review = {
  id: string
  villaId: string
  villaName: string
  guestName: string
  ratingOverall: number
  comment: string
  createdAt: string
  isApproved: boolean
  ownerReply?: string
}

const allReviews: Review[] = villas.flatMap(v =>
  v.reviews.map(r => ({
    id: r.id,
    villaId: v.id,
    villaName: v.translations.tr.name,
    guestName: r.guestName,
    ratingOverall: r.ratingOverall,
    comment: r.comment,
    createdAt: r.createdAt,
    isApproved: true,
    ownerReply: undefined,
  }))
)

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(allReviews)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const filtered = reviews.filter(r => {
    const matchSearch = r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.villaName.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'approved' && r.isApproved) || (filter === 'pending' && !r.isApproved)
    return matchSearch && matchFilter
  })

  const approve = (id: string) => setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r))
  const reject = (id: string) => setReviews(prev => prev.filter(r => r.id !== id))
  const saveReply = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ownerReply: replyText } : r))
    setReplyingTo(null)
    setReplyText('')
  }

  const avgRating = (reviews.reduce((s, r) => s + r.ratingOverall, 0) / reviews.length).toFixed(1)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Değerlendirmeler</h2>
          <p className="text-stone-400 text-sm mt-0.5">{reviews.length} yorum · Ortalama {avgRating} ★</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[5, 4, 3].map(star => {
          const count = reviews.filter(r => r.ratingOverall === star).length
          return (
            <div key={star} className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="text-2xl font-bold text-stone-800">{count}</div>
              <div className="text-stone-400 text-xs">{star} yıldız</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Misafir veya villa ara..."
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
        <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
          {(['all', 'approved', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500'}`}
            >
              {f === 'all' ? 'Tümü' : f === 'approved' ? 'Onaylı' : 'Beklemede'}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold text-sm">
                    {review.guestName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 text-sm">{review.guestName}</div>
                    <div className="text-stone-400 text-xs">{review.villaName} · {review.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < review.ratingOverall ? 'text-amber-400 fill-amber-400' : 'text-stone-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>

                {review.ownerReply && (
                  <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl p-3">
                    <div className="text-xs font-semibold text-sky-700 mb-1">Yanıtınız</div>
                    <p className="text-sky-800 text-sm">{review.ownerReply}</p>
                  </div>
                )}

                {replyingTo === review.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Misafire yanıt yazın..."
                      rows={3}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveReply(review.id)}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
                      >
                        Yanıtla
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm hover:bg-stone-50"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {!review.ownerReply && replyingTo !== review.id && (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-500 rounded-lg text-xs hover:bg-stone-50"
                  >
                    <MessageSquare size={12} /> Yanıtla
                  </button>
                )}
                {!review.isApproved && (
                  <button
                    onClick={() => approve(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs hover:bg-emerald-200"
                  >
                    <CheckCircle size={12} /> Onayla
                  </button>
                )}
                <button
                  onClick={() => reject(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs hover:bg-rose-100"
                >
                  <XCircle size={12} /> Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
