import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { ReservationStatusFilter } from '../utils/reservation'
import type { ReservationSortOption } from '../types/reservation'
import { STATUS_FILTER_LABELS, SORT_LABELS } from '../constants/labels'

interface ReservationControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: ReservationStatusFilter
  onStatusFilterChange: (value: ReservationStatusFilter) => void
  sortOption: ReservationSortOption
  onSortOptionChange: (value: ReservationSortOption) => void
}

export function ReservationControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
}: ReservationControlsProps) {
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      gap={2}
      mb={3}
      flexWrap="wrap"
      alignItems={isMobile ? 'stretch' : 'flex-end'}
    >
      <TextField
        label="جستجو"
        placeholder="نام، شماره تلفن یا خدمت"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 200, flex: 1 }}
        size="small"
      />

      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>وضعیت</InputLabel>
        <Select
          label="وضعیت"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as ReservationStatusFilter)}
        >
          {Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>مرتب‌سازی</InputLabel>
        <Select
          label="مرتب‌سازی"
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value as ReservationSortOption)}
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}