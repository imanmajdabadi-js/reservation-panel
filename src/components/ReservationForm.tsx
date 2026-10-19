import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import type { SelectChangeEvent } from '@mui/material/Select'
import { normalizeTimeInput, parseDate, parseTime } from '../utils/datetime'
import { validateIranianMobile } from '../utils/phone'
import type { Reservation, ReservationService } from '../types/reservation'
import { SERVICE_LABELS } from '../constants/labels'
import { normalizeCustomerName } from '../utils/reservation'
import { normalizeDigits, toPersianDigits } from '../utils/digits'
import { toGregorianISO } from '../utils/jalaliDate'
import { JalaliDatePicker } from './JalaliDatePicker'

interface FormState {
  customerName: string
  phone: string
  service: ReservationService
  date: string
  time: string
  description: string
}

interface FieldErrors {
  customerName?: string
  phone?: string
  service?: string
  date?: string
  time?: string
}

export interface ReservationFormProps {
  open: boolean
  existingReservations: readonly Reservation[]
  onClose: () => void
  onSubmit: (reservation: Omit<Reservation, 'id'>) => string | null
}

export function ReservationForm({
  open,
  existingReservations,
  onClose,
  onSubmit,
}: ReservationFormProps) {
  const [form, setForm] = useState<FormState>({
    customerName: '',
    phone: '',
    service: 'consultation',
    date: toGregorianISO(new Date()),
    time: '',
    description: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const submitLock = useRef(false)

  useEffect(() => {
    if (open) {
      submitLock.current = false
    }
  }, [open])

  const resetForm = () => {
    setForm({
      customerName: '',
      phone: '',
      service: 'consultation',
      date: toGregorianISO(new Date()),
      time: '',
      description: '',
    })
    setErrors({})
  }

  const closeForm = () => {
    resetForm()
    submitLock.current = false
    onClose()
  }

  const handleTextChange = (field: 'customerName' | 'description') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phone: normalizeDigits(event.target.value) }))
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, time: normalizeDigits(event.target.value) }))
    setErrors((prev) => ({ ...prev, time: undefined }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, service: event.target.value as ReservationService }))
    setErrors((prev) => ({ ...prev, service: undefined }))
  }

  const handleDateChange = (isoDate: string) => {
    setForm((prev) => ({ ...prev, date: isoDate }))
    setErrors((prev) => ({ ...prev, date: undefined }))
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}

    const normalizedName = normalizeCustomerName(form.customerName)
    if (!normalizedName) {
      next.customerName = 'نام مشتری الزامی است'
    }

    const phoneResult = validateIranianMobile(form.phone)
    if (!phoneResult.valid) {
      next.phone = phoneResult.message
    } else if (
      existingReservations.some((reservation) => {
        const existingPhone = validateIranianMobile(reservation.phone)
        return existingPhone.valid && existingPhone.normalized === phoneResult.normalized
      })
    ) {
      next.phone = 'این شماره تلفن پیش‌تر برای مشتری دیگری ثبت شده است'
    }

    if (!form.service) {
      next.service = 'خدمت انتخابی الزامی است'
    }

    if (!parseDate(form.date)) {
      next.date = 'تاریخ نامعتبر است'
    }

    if (!parseTime(normalizeTimeInput(form.time))) {
      next.time = 'ساعت نامعتبر است'
    }

    return next
  }

  const handleSubmit = () => {
    if (submitLock.current) {
      return
    }
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    const phoneResult = validateIranianMobile(form.phone)
    if (!phoneResult.valid) return

    submitLock.current = true
    const newReservation: Omit<Reservation, 'id'> = {
      customerName: normalizeCustomerName(form.customerName),
      phone: phoneResult.normalized,
      service: form.service,
      date: form.date,
      time: normalizeTimeInput(form.time),
      status: 'pending',
      description: form.description.trim() || undefined,
    }

    const submissionError = onSubmit(newReservation)
    if (submissionError) {
      submitLock.current = false
      setErrors((prev) => ({ ...prev, phone: submissionError }))
      return
    }
    resetForm()
    onClose()
  }

  const normalizedName = normalizeCustomerName(form.customerName)
  const hasDuplicateName =
    normalizedName !== '' &&
    existingReservations.some(
      (reservation) => normalizeCustomerName(reservation.customerName) === normalizedName
    )

  return (
    <Dialog
      open={open}
      onClose={closeForm}
      maxWidth="sm"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 0.5 }}>
        ثبت رزرو جدید
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Stack direction="column" gap={2} mt={0.5}>
          <TextField
            label="نام مشتری"
            placeholder="نام کامل مشتری"
            value={form.customerName}
            onChange={handleTextChange('customerName')}
            error={Boolean(errors.customerName)}
            helperText={errors.customerName}
            size="small"
            autoFocus
          />

          <TextField
            label="شماره تلفن"
            placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
            value={toPersianDigits(form.phone)}
            onChange={handlePhoneChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            size="small"
            inputProps={{ inputMode: 'tel', dir: 'rtl' }}
          />
          {hasDuplicateName && (
            <Alert severity="warning" sx={{ mt: -1 }}>
              مشتری دیگری با این نام ثبت شده است؛ در صورت متفاوت بودن شماره تلفن می‌توانید ادامه دهید.
            </Alert>
          )}

          <FormControl size="small" error={Boolean(errors.service)}>
            <InputLabel>خدمت</InputLabel>
            <Select
              label="خدمت"
              value={form.service}
              onChange={handleSelectChange}
            >
              {Object.entries(SERVICE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <JalaliDatePicker
            value={form.date}
            onChange={handleDateChange}
            label="تاریخ"
            error={Boolean(errors.date)}
            helperText={errors.date}
          />

          <TextField
            label="ساعت"
            type="text"
            value={toPersianDigits(form.time)}
            onChange={handleTimeChange}
            onBlur={() =>
              setForm((prev) => ({ ...prev, time: normalizeTimeInput(prev.time) }))
            }
            error={Boolean(errors.time)}
            helperText={errors.time}
            size="small"
            placeholder="۱۲۲۰"
            inputProps={{
              inputMode: 'numeric',
              dir: 'ltr',
              maxLength: 5,
              style: { textAlign: 'left' },
            }}
          />

          <TextField
            label="توضیحات (اختیاری)"
            placeholder="توضیحات تکمیلی"
            value={form.description}
            onChange={handleTextChange('description')}
            size="small"
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={closeForm} color="inherit">
          انصراف
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          ثبت رزرو
        </Button>
      </DialogActions>
    </Dialog>
  )
}