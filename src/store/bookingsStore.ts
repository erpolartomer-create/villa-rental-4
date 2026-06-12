'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Booking, BookingStatus } from '@/types/villa'

interface BookingsStore {
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  updateBookingStatus: (id: string, status: BookingStatus) => void
  deleteBooking: (id: string) => void
  getBookingById: (id: string) => Booking | undefined
}

export const useBookingsStore = create<BookingsStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) =>
        set(state => ({ bookings: [...state.bookings, booking] })),

      updateBookingStatus: (id, status) =>
        set(state => ({
          bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b),
        })),

      deleteBooking: (id) =>
        set(state => ({ bookings: state.bookings.filter(b => b.id !== id) })),

      getBookingById: (id) => get().bookings.find(b => b.id === id),
    }),
    { name: 'bookings-store', skipHydration: true }
  )
)
