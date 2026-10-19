import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import { mockReservations } from '../data/mockReservations';
import type { Reservation, ReservationSortOption, ReservationStatus } from '../types/reservation';
import { validateIranianMobile } from '../utils/phone';
import {
  canTransitionStatus,
  filterByStatus,
  searchReservations,
  sortReservations,
  type ReservationStatusFilter,
} from '../utils/reservation';
import { EmptyState } from './EmptyState';
import { ReservationCard } from './ReservationCard';
import { ReservationControls } from './ReservationControls';
import { ReservationDetails } from './ReservationDetails';
import { ReservationForm } from './ReservationForm';
import { ReservationTable } from './ReservationTable';
import { SummaryStats } from './SummaryStats';

// function createReservationId(): string {
//   const webCrypto = globalThis.crypto;

//   if (typeof webCrypto.randomUUID === 'function') {
//     return `res-${webCrypto.randomUUID()}`;
//   }

//   const bytes = webCrypto.getRandomValues(new Uint8Array(16));
//   bytes[6] = (bytes[6] & 0x0f) | 0x40;
//   bytes[8] = (bytes[8] & 0x3f) | 0x80;
//   const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
//   const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;

//   return `res-${uuid}`;
// }

export function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsReservation, setDetailsReservation] = useState<Reservation | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatusFilter>('all');
  const [sortOption, setSortOption] = useState<ReservationSortOption>('newest');
  const successMessageTimeout = useRef<number | null>(null);

  const isMobile = useMediaQuery('(max-width:900px)');

  const clearSuccessMessageTimeout = () => {
    if (successMessageTimeout.current !== null) {
      clearTimeout(successMessageTimeout.current);
      successMessageTimeout.current = null;
    }
  };

  const showSuccessMessage = (message: string) => {
    clearSuccessMessageTimeout();
    setSuccessMessage(message);
    successMessageTimeout.current = setTimeout(() => {
      setSuccessMessage('');
      successMessageTimeout.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearSuccessMessageTimeout();
    };
  }, []);

  const filtered = sortReservations(
    searchReservations(filterByStatus(reservations, statusFilter), searchQuery),
    sortOption
  );

  const hasFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  const handleAddReservation = (data: Omit<Reservation, 'id'>): string | null => {
    const phoneResult = validateIranianMobile(data.phone);
    if (!phoneResult.valid) {
      return phoneResult.message;
    }
    if (
      reservations.some((reservation) => {
        const existing = validateIranianMobile(reservation.phone);
        return existing.valid && existing.normalized === phoneResult.normalized;
      })
    ) {
      return 'این شماره تلفن پیش‌تر برای مشتری دیگری ثبت شده است';
    }

    const newReservation: Reservation = {
      ...data,
      id: Math.random().toString(),
    };
    setReservations((prev) => [newReservation, ...prev]);
    showSuccessMessage('رزرو با موفقیت ثبت شد');
    return null;
  };

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    const currentReservation = reservations.find((reservation) => reservation.id === id);
    if (!currentReservation || !canTransitionStatus(currentReservation.status, newStatus)) {
      return;
    }

    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setDetailsReservation((current) =>
      current?.id === id ? { ...current, status: newStatus } : current
    );
    showSuccessMessage('وضعیت رزرو با موفقیت تغییر کرد');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          سیستم مدیریت رزرو
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          پنل مدیریت رزروهای مشتریان
        </Typography>
      </Box>

      <SummaryStats reservations={reservations} />

      {successMessage && (
        <Alert
          severity="success"
          closeText="بستن"
          sx={{ mb: 2 }}
          onClose={() => {
            clearSuccessMessageTimeout();
            setSuccessMessage('');
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" fontWeight={500}>
          لیست رزروها
        </Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          ثبت رزرو جدید
        </Button>
      </Box>

      <ReservationControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="رزروی یافت نشد"
          description={
            hasFilters
              ? 'با معیارهای جستجو و فیلترهای انتخاب‌شده، رزروی یافت نشد. فیلترها را تغییر دهید.'
              : 'هنوز رزروی ثبت نشده است.'
          }
        />
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexDirection: 'column' }}>
          {filtered.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onClick={() => setDetailsReservation(reservation)}
            />
          ))}
        </Box>
      ) : (
        <ReservationTable reservations={filtered} onRowClick={setDetailsReservation} />
      )}

      <ReservationForm
        open={formOpen}
        existingReservations={reservations}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAddReservation}
      />

      <ReservationDetails
        open={detailsReservation !== null}
        reservation={detailsReservation}
        onClose={() => setDetailsReservation(null)}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
}
