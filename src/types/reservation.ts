export type ReservationService = 'consultation' | 'meeting' | 'support' | 'other'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export type ReservationSortOption = 'newest' | 'oldest' | 'name'

export interface Reservation {
  id: string
  customerName: string
  phone: string
  service: ReservationService
  date: string
  time: string
  status: ReservationStatus
  description?: string
}