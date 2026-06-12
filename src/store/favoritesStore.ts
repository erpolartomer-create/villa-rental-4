'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: string[]
  toggleFavorite: (villaId: string) => void
  isFavorite: (villaId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (villaId) => {
        const { favorites } = get()
        if (favorites.includes(villaId)) {
          set({ favorites: favorites.filter(id => id !== villaId) })
        } else {
          set({ favorites: [...favorites, villaId] })
        }
      },
      isFavorite: (villaId) => get().favorites.includes(villaId),
    }),
    { name: 'villa-favorites', skipHydration: true }
  )
)
