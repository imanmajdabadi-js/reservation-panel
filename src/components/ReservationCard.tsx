import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import type { Reservation } from '../types/reservation'
import { formatDate, formatTime } from '../utils/datetime'
import { StatusBadge } from './StatusBadge'
import { SERVICE_LABELS } from '../constants/labels'

interface ReservationCardProps {
  reservation: Reservation
  onClick: () => void
}

export function ReservationCard({ reservation, onClick }: ReservationCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {reservation.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {SERVICE_LABELS[reservation.service]}
            </Typography>
          </Box>
          <StatusBadge status={reservation.status} />
        </Stack>

        <Stack direction="row" gap={2} mt={1.5} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            {formatDate(reservation.date)} - {formatTime(reservation.time)}
          </Typography>
        </Stack>

        {reservation.description && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {reservation.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}