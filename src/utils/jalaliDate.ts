import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  getMonth,
  getYear,
  getDate,
  addMonths,
  subMonths,
  isSameDay as _isSameDay,
} from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'
import { toPersianDigits } from './digits'

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]

export const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function toGregorianISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromGregorianISO(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function toJalaliDisplay(date: Date): string {
  return toPersianDigits(format(date, 'yyyy/MM/dd', { locale: faIR }))
}

export function formatMonthYear(date: Date): string {
  return `${PERSIAN_MONTHS[getMonth(date)]} ${toPersianDigits(String(getYear(date)))}`
}

export function getMonthDays(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) })
}

export function changeMonth(date: Date, direction: number): Date {
  return direction > 0 ? addMonths(date, 1) : subMonths(date, 1)
}

export function getWeekdayColumn(dayOfWeek: number): number {
  // getDay(): 0=Sunday, 6=Saturday
  // Persian week: Saturday=col 0, Sunday=col 1, ..., Friday=col 6
  return (dayOfWeek + 1) % 7
}

export function buildCalendarGrid(monthDate: Date): (Date | null)[][] {
  const days = getMonthDays(monthDate)
  const firstDay = startOfMonth(monthDate)
  const startCol = getWeekdayColumn(getDay(firstDay))

  const weeks: (Date | null)[][] = []
  let week: (Date | null)[] = []

  for (let i = 0; i < startCol; i++) {
    week.push(null)
  }

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  while (week.length > 0 && week.length < 7) {
    week.push(null)
  }
  if (week.length > 0) weeks.push(week)

  return weeks
}

export function isSameDay(a: Date, b: Date): boolean {
  return _isSameDay(a, b)
}

export function isSameMonth(a: Date, b: Date): boolean {
  return getMonth(a) === getMonth(b) && getYear(a) === getYear(b)
}

export { getDate }