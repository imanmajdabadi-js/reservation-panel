import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { Reservation } from '../types/reservation'
import { toPersianDigits } from '../utils/digits'

function localToday(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

interface SummaryStatsProps {
  reservations: Reservation[]
}

export function SummaryStats({ reservations }: SummaryStatsProps) {
  const total = reservations.length
  const todayCount = reservations.filter((r) => r.date === localToday()).length
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length
  const cancelledCount = reservations.filter((r) => r.status === 'cancelled').length

  const stats = [
    { label: 'کل رزروها', value: toPersianDigits(total), color: 'primary.main' },
    { label: 'امروز', value: toPersianDigits(todayCount), color: 'warning.main' },
    { label: 'تأیید شده', value: toPersianDigits(confirmedCount), color: 'success.main' },
    { label: 'لغو شده', value: toPersianDigits(cancelledCount), color: 'error.main' },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 2,
        mb: 4,
      }}
    >
      {stats.map((stat) => (
        <Card key={stat.label} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h4" color={stat.color} sx={{ mt: 0.5 }}>
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}