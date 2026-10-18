import Chip from '@mui/material/Chip'
import type { ReservationStatus } from '../types/reservation'
import { STATUS_LABELS } from '../constants/labels'

const STATUS_COLOR: Record<ReservationStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
}

interface StatusBadgeProps {
  status: ReservationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Chip
      label={STATUS_LABELS[status]}
      color={STATUS_COLOR[status]}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  )
}