'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'

interface Props {
  villaId: string
}

export function FavoriteButton({ villaId }: Props) {
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const favorite = mounted && isFavorite(villaId)

  return (
    <button
      onClick={() => toggleFavorite(villaId)}
      aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className="p-2 rounded-xl transition-all duration-200 hover:bg-rose-50"
    >
      <Heart
        size={20}
        className={`transition-all duration-200 ${
          favorite
            ? 'fill-rose-500 text-rose-500 scale-110'
            : 'text-[#9b9389] hover:text-rose-400'
        }`}
      />
    </button>
  )
}
