'use client'
import { create } from 'zustand'

interface BookingState {
  checkin: string | null
  checkout: string | null
  adults: number
  children: number
  babies: number
  setDates: (checkin: string, checkout: string) => void
  setGuests: (adults: number, children: number, babies: number) => void
  clearDates: () => void
  getNights: () => number
}

export const useBookingStore = create<BookingState>((set, get) => ({
  checkin: null,
  checkout: null,
  adults: 2,
  children: 0,
  babies: 0,
  setDates: (checkin, checkout) => set({ checkin, checkout }),
  setGuests: (adults, children, babies) => set({ adults, children, babies }),
  clearDates: () => set({ checkin: null, checkout: null }),
  getNights: () => {
    const { checkin, checkout } = get()
    if (!checkin || !checkout) return 0
    const start = new Date(checkin)
    const end = new Date(checkout)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  },
}))
