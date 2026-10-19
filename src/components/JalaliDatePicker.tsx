import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import useMediaQuery from '@mui/material/useMediaQuery'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedDayButtonRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMediaQuery('(max-width:600px)')

  const open = (anchor: HTMLElement, focusSelectedDay = false) => {
    setAnchorEl(anchor)
    setViewDate(fromGregorianISO(value) || new Date())

    if (focusSelectedDay) {
      setTimeout(() => selectedDayButtonRef.current?.focus(), 0)
    }
  }

  const close = () => setAnchorEl(null)

  const handleDaySelect = (day: Date) => {
    onChange(toGregorianISO(day))
    close()
    inputRef.current?.focus()
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
          inputRef={inputRef}
          label={label}
          value={selectedDate ? toJalaliDisplay(selectedDate) : ''}
          onClick={(event) => open(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
              event.preventDefault()
              open(event.currentTarget, true)
            } else if (event.key === 'Escape' && anchorEl) {
              event.preventDefault()
              event.stopPropagation()
              close()
            }
          }}
          error={error}
          helperText={helperText}
          size="small"
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          inputProps={{
            'aria-haspopup': 'dialog',
            'aria-expanded': Boolean(anchorEl),
            'aria-controls': anchorEl ? 'jalali-date-picker-calendar' : undefined,
          }}
          sx={{
            cursor: 'pointer',
            width: '100%',
            '& .MuiInputBase-input': { cursor: 'pointer', textAlign: 'right' },
          }}
        />
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          container={anchorEl?.closest('.MuiDialog-container') ?? undefined}
          placement={isMobile ? 'top-start' : 'bottom-start'}
          modifiers={[
            { name: 'flip', enabled: true, options: { boundary: 'viewport', padding: 8 } },
            {
              name: 'preventOverflow',
              enabled: true,
              options: { boundary: 'viewport', padding: 8, escapeMargins: true },
            },
            { name: 'offset', options: { offset: [0, 4] } },
          ]}
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 20,
          }}
        >
          <Paper
            id="jalali-date-picker-calendar"
            role="dialog"
            aria-label={`انتخاب ${label}`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation()
                close()
                inputRef.current?.focus()
              }
            }}
            elevation={8}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 1.5,
              width: 'min(320px, calc(100vw - 32px))',
              boxSizing: 'border-box',
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
                    <ButtonBase
                      key={dayIndex}
                      ref={selected ? selectedDayButtonRef : undefined}
                      onClick={() => handleDaySelect(day)}
                      type="button"
                      aria-label={toJalaliDisplay(day)}
                      aria-pressed={selected}
                      aria-current={isToday ? 'date' : undefined}
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
                    >
                      {toPersianDigits(getDate(day))}
                    </ButtonBase>
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
