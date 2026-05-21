export type Booking = {
    id: number | null;
    date: string | null;
    user: string;
};

export type BookingRow = {
    id: number;
    date: string;
    user: string;
};

export type NewBooking = {
    date: string | null;
    user: string;
};

export type CalendarProps = {
    bookings: Booking[];
    currentUser: string;
    refreshBookings: () => void;
};