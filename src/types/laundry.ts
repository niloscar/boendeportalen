export type Timeslot = {
    id: number;
    start: string;
    end: string;
};

export type TimeslotRow = {
    id: number;
    slot_start: string;
    slot_end: string;
};

export type Booking = {
    id: number | null;
    date: string | null;
    slot: number | null;
    user: number;
};

export type BookingRow = {
    id: number;
    date: string;
    slot: number;
    user: number;
};

export type NewBooking = {
    date: string | null;
    slot: number | null;
    user: number;
};

export type CalendarProps = {
    bookings: Booking[];
    timeslots: Timeslot[];
    currentUser: number;
    refreshBookings: () => void;
};