import { useState } from 'react'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { toPersianDigits } from '../utils/digits'
import {
  PERSIAN_WEEKDAYS,
  buildCalendarGrid,
  changeMonth,
  formatMonthYear,
  fromGregorianISO,
  getDate,
  isSameDay,
  toGregorianISO,
  toJalaliDisplay,
} from '../utils/jalaliDate'

interface JalaliDatePickerProps {
  value: string
  onChange: (isoDate: string) => void
  label?: string
  error?: boolean
  helperText?: string
}

export function JalaliDatePicker({
  value,
  onChange,
  label = 'تاریخ',
  error,
  helperText,
}: JalaliDatePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [viewDate, setViewDate] = useState<Date>(() => fromGregorianISO(value) || new Date())

  const open = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setViewDate(fromGregorianISO(value) || new Date())
  }

  const close = () => setAnchorEl(null)

  const handleDaySelect = (day: Date) => {
    onChange(toGregorianISO(day))
    close()
  }

  const handlePrevMonth = () => setViewDate((prev) => changeMonth(prev, -1))
  const handleNextMonth = () => setViewDate((prev) => changeMonth(prev, 1))

  const grid = buildCalendarGrid(viewDate)
  const today = new Date()
  const selectedDate = fromGregorianISO(value)

  return (
    <ClickAwayListener onClickAway={(event) => {
      if (anchorEl && anchorEl.contains(event.target as Node)) {
        return
      }
      close()
    }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          label={label}
          value={selectedDate ? toJalaliDisplay(selectedDate) : ''}
          onClick={open}
          error={error}
          helperText={helperText}
          size="small"
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          sx={{
            cursor: 'pointer',
            width: '100%',
            '& .MuiInputBase-input': { cursor: 'pointer', textAlign: 'right' },
          }}
        />
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal={false}
          modifiers={[
            { name: 'flip', enabled: true, options: { padding: 8 } },
            { name: 'preventOverflow', enabled: true, options: { padding: 8, escapeMargins: true } },
            { name: 'offset', options: { offset: [0, 4] } },
          ]}
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 20,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 1.5,
              width: 'min(320px, calc(100vw - 32px))',
              minWidth: 0,
              maxHeight: '80vh',
              overflowY: 'auto',
              direction: 'rtl',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <IconButton size="small" onClick={handleNextMonth} aria-label="ماه بعد">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </IconButton>
              <Typography variant="body2" fontWeight={600}>
                {formatMonthYear(viewDate)}
              </Typography>
              <IconButton size="small" onClick={handlePrevMonth} aria-label="ماه قبل">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </IconButton>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.25,
                mb: 0.5,
              }}
            >
              {PERSIAN_WEEKDAYS.map((day) => (
                <Box
                  key={day}
                  sx={{
                    textAlign: 'center',
                    py: 0.5,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>
            {grid.map((week, weekIndex) => (
              <Box
                key={weekIndex}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 0.25,
                  mb: 0.25,
                }}
              >
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <Box key={dayIndex} sx={{ aspectRatio: '1' }} />
                  }
                  const selected = selectedDate ? isSameDay(day, selectedDate) : false
                  const isToday = isSameDay(day, today)
                  return (
                    <Box
                      key={dayIndex}
                      onClick={() => handleDaySelect(day)}
                      sx={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: selected ? 700 : 400,
                        color: selected ? 'common.white' : 'text.primary',
                        bgcolor: selected ? 'primary.main' : 'transparent',
                        outline: isToday && !selected ? '2px solid' : 'none',
                        outlineColor: isToday ? 'primary.main' : 'transparent',
                        outlineOffset: '1px',
                        '&:hover': {
                          bgcolor: selected ? 'primary.dark' : 'action.hover',
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        },
                      }}
                      tabIndex={0}
                      role="gridcell"
                      aria-selected={selected}
                      aria-label={toJalaliDisplay(day)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleDaySelect(day)
                        }
                      }}
                    >
                      {toPersianDigits(getDate(day))}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}
