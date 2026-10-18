import type { ReservationService, ReservationStatus } from '../types/reservation';

export const SERVICE_LABELS: Record<ReservationService, string> = {
  consultation: 'مشاوره',
  meeting: 'جلسه',
  support: 'پشتیبانی',
  other: 'سایر',
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'در انتظار',
  confirmed: 'تأیید شده',
  cancelled: 'لغو شده',
};

export const STATUS_FILTER_LABELS: Record<'all' | ReservationStatus, string> = {
  all: 'همه',
  pending: 'در انتظار',
  confirmed: 'تأیید شده',
  cancelled: 'لغو شده',
};

export const SORT_LABELS: Record<'newest' | 'oldest' | 'name', string> = {
  newest: 'جدیدترین',
  oldest: 'قدیمی‌ترین',
  name: 'بر حسب نام',
};
