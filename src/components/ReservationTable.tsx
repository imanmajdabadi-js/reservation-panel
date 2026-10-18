import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { Reservation } from '../types/reservation'
import { formatDate, formatTime } from '../utils/datetime'
import { toPersianDigits } from '../utils/digits'
import { StatusBadge } from './StatusBadge'
import { SERVICE_LABELS } from '../constants/labels'

interface ReservationTableProps {
  reservations: Reservation[]
  onRowClick: (reservation: Reservation) => void
}

export function ReservationTable({ reservations, onRowClick }: ReservationTableProps) {
  return (
    <TableContainer>
      <Table size="medium" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ background: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>مشتری</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>شماره تماس</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>تاریخ</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ساعت</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>خدمت</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>وضعیت</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              hover
              tabIndex={0}
              aria-label={`مشاهده جزئیات رزرو ${reservation.customerName}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onRowClick(reservation)
                }
              }}
              sx={{
                cursor: 'pointer',
                '&:hover': { background: 'action.hover' },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
              }}
              onClick={() => onRowClick(reservation)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {reservation.customerName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary" dir="ltr" textAlign="right">
                  {toPersianDigits(reservation.phone)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(reservation.date)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(reservation.time)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap>
                  {SERVICE_LABELS[reservation.service]}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusBadge status={reservation.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}