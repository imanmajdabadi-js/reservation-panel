const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

const digitLookup: Record<string, string> = {}

for (let i = 0; i < 10; i++) {
  digitLookup[PERSIAN_DIGITS[i]] = String(i)
  digitLookup[ARABIC_INDIC_DIGITS[i]] = String(i)
}


export function normalizeDigits(value: string): string {
  if (!value) {
    return ''
  }

  let result = ''
  for (let i = 0; i < value.length; i++) {
    const replacement = digitLookup[value[i]]
    result += replacement !== undefined ? replacement : value[i]
  }
  return result
}

export function toPersianDigits(value: string | number): string {
  const str = String(value)
  if (!str) {
    return ''
  }

  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char >= '0' && char <= '9') {
      result += PERSIAN_DIGITS[Number(char)]
    } else {
      result += char
    }
  }
  return result
}
