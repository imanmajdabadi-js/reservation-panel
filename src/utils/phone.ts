import { normalizeDigits } from './digits'

export interface PhoneValidationResult {
  valid: true
  normalized: string
}

export interface PhoneValidationError {
  valid: false
  message: string
}

export type PhoneValidation = PhoneValidationResult | PhoneValidationError

export function validateIranianMobile(phone: string): PhoneValidation {
  const normalized = normalizeDigits(phone).trim()

  if (normalized.length !== 11) {
    return { valid: false, message: 'شماره تلفن باید ۱۱ رقمی باشد' }
  }

  if (!/^09\d{9}$/.test(normalized)) {
    if (!normalized.startsWith('09')) {
      return { valid: false, message: 'شماره تلفن باید با ۰۹ شروع شود' }
    }
    return { valid: false, message: 'شماره تلفن فقط باید شامل اعداد باشد' }
  }

  return { valid: true, normalized }
}