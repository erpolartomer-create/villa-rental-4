'use client'
import { useEffect } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useBookingsStore } from '@/store/bookingsStore'
import { useBlogStore } from '@/store/blogStore'
import { useVillaStore } from '@/store/villaStore'

/**
 * Persisted Zustand stores are created with `skipHydration: true` so the first
 * client render matches the server (default values) — avoiding hydration
 * mismatches that caused the whole tree (images included) to flash/repaint.
 * Here we rehydrate them from localStorage once, after mount.
 */
export function StoreHydration() {
  useEffect(() => {
    useCurrencyStore.persist.rehydrate()
    useFavoritesStore.persist.rehydrate()
    useSettingsStore.persist.rehydrate()
    useBookingsStore.persist.rehydrate()
    useBlogStore.persist.rehydrate()
    useVillaStore.persist.rehydrate()
  }, [])

  return null
}
