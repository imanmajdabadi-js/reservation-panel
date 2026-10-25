import { SERVICE_LABELS } from '../constants/labels';
import type { Reservation, ReservationSortOption, ReservationStatus } from '../types/reservation';
import { toComparableTimestamp } from './datetime';
import { normalizeDigits } from './digits';
export type ReservationStatusFilter = 'all' | ReservationStatus;

const ALLOWED_STATUS_TRANSITIONS: Record<ReservationStatus, readonly ReservationStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['cancelled'],
  cancelled: [],
};

export function canTransitionStatus(current: ReservationStatus, next: ReservationStatus): boolean {
  return ALLOWED_STATUS_TRANSITIONS[current].includes(next);
}

export function normalizeCustomerName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function filterByStatus(
  reservations: readonly Reservation[],
  status: ReservationStatusFilter
): Reservation[] {
  if (status === 'all') {
    return reservations.slice();
  }

  return reservations.filter((reservation) => reservation.status === status);
}

export function searchReservations(
  reservations: readonly Reservation[],
  query: string
): Reservation[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return reservations.slice();
  }

  const normalizedQuery = normalizeDigits(trimmed).toLowerCase();

  return reservations.filter((reservation) => {
    const candidates = [
      reservation.customerName,
      reservation.phone,
      SERVICE_LABELS[reservation.service],
      reservation.description ?? '',
    ];

    return candidates.some((candidate) =>
      normalizeDigits(candidate).toLowerCase().includes(normalizedQuery)
    );
  });
}

export function sortReservations(
  reservations: readonly Reservation[],
  sort: ReservationSortOption
): Reservation[] {
  const sorted = reservations.slice();

  if (sort === 'name') {
    return sorted.sort((a, b) => a.customerName.localeCompare(b.customerName, 'fa'));
  }

  return sorted.sort((a, b) => {
    const timestampA = toComparableTimestamp(a.date, a.time);
    const timestampB = toComparableTimestamp(b.date, b.time);

    return sort === 'newest' ? timestampB - timestampA : timestampA - timestampB;
  });
}
