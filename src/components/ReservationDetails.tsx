import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SERVICE_LABELS } from '../constants/labels';
import type { Reservation, ReservationStatus } from '../types/reservation';
import { formatDate, formatTime } from '../utils/datetime';
import { toPersianDigits } from '../utils/digits';
import { StatusBadge } from './StatusBadge';

interface StatusAction {
  target: ReservationStatus;
  label: string;
  color: 'success' | 'error' | 'primary';
}

function getActions(status: ReservationStatus): StatusAction[] {
  switch (status) {
    case 'pending':
      return [
        { target: 'confirmed', label: 'تأیید رزرو', color: 'success' },
        { target: 'cancelled', label: 'لغو کردن', color: 'error' },
      ];
    case 'confirmed':
      return [{ target: 'cancelled', label: 'لغو کردن', color: 'error' }];
    case 'cancelled':
      return [];
  }
}

interface ReservationDetailsProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
}

export function ReservationDetails({
  open,
  reservation,
  onClose,
  onStatusChange,
}: ReservationDetailsProps) {
  if (!reservation) {
    return null;
  }

  const actions = getActions(reservation.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 0.5 }}>جزئیات رزرو</DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Stack direction="column" gap={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              نام مشتری
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reservation.customerName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              شماره تلفن
            </Typography>
            <Typography variant="body1">{toPersianDigits(reservation.phone)}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              خدمت
            </Typography>
            <Typography variant="body1">{SERVICE_LABELS[reservation.service]}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              تاریخ و ساعت
            </Typography>
            <Typography variant="body1">
              {formatDate(reservation.date)} - {formatTime(reservation.time)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              وضعیت
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <StatusBadge status={reservation.status} />
            </Box>
          </Box>

          {reservation.description && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                توضیحات
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {reservation.description}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          gap: 2,
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
          <StatusBadge status={reservation.status} />
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          alignItems="stretch"
        >
          {actions.map((action) => (
            <Button
              key={action.target}
              variant="contained"
              color={action.color}
              onClick={() => onStatusChange(reservation.id, action.target)}
              sx={{
                minHeight: 20,
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {action.label}
            </Button>
          ))}
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            sx={{
              minHeight: 20,
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              borderColor: { xs: 'divider', sm: 'transparent' },
            }}
          >
            بستن
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
