import { format } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'
import { normalizeDigits, toPersianDigits } from './digits'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}$/

export interface ParsedTime {
  hours: number
  minutes: number
}

export function normalizeTimeInput(time: string): string {
  const normalized = normalizeDigits(time).trim()

  if (/^\d{4}$/.test(normalized)) {
    return `${normalized.slice(0, 2)}:${normalized.slice(2)}`
  }

  return normalized
}

export function parseDate(date: string): Date | null {
  if (!DATE_PATTERN.test(date)) {
    return null
  }

  const [yearPart, monthPart, dayPart] = date.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)
  const day = Number(dayPart)

  // Construct in local time to avoid UTC shifts; validate that the
  // components round-trip (rejects e.g. 2026-02-30).
  const parsed = new Date(year, month - 1, day)

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null
  }

  return parsed
}

export function parseTime(time: string): ParsedTime | null {
  const normalized = normalizeDigits(time).trim()
  if (!TIME_PATTERN.test(normalized)) {
    return null
  }

  const [hoursPart, minutesPart] = normalized.split(':')
  const hours = Number(hoursPart)
  const minutes = Number(minutesPart)

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }

  return { hours, minutes }
}

export function formatDate(date: string): string {
  const parsed = parseDate(date)
  if (!parsed) {
    return '—'
  }

  return toPersianDigits(format(parsed, 'yyyy/MM/dd', { locale: faIR }))
}

export function formatTime(time: string): string {
  const parsed = parseTime(time)
  if (!parsed) {
    return '—'
  }

  return toPersianDigits(
    format(new Date(2000, 0, 1, parsed.hours, parsed.minutes), 'HH:mm', { locale: faIR })
  )
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} ${formatTime(time)}`
}

export function toComparableTimestamp(date: string, time: string): number {
  const parsedDate = parseDate(date)
  const parsedTime = parseTime(time)

  if (!parsedDate || !parsedTime) {
    return Number.POSITIVE_INFINITY
  }

  parsedDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0)
  return parsedDate.getTime()
}
