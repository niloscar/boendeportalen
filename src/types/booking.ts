import type { User } from '@supabase/supabase-js'

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
    user: string;
};

export type BookingRow = {
    id: number;
    date: string;
    slot: number | null;
    user: string;
};

export type NewBooking = {
    date: string | null;
    slot: number | null;
    user: string;
};

export type GuestSuiteCalendarProps = {
    bookings: Booking[];
    refreshBookings: () => Promise<void>;
};

export type LaundryRoomCalendarProps = {
    bookings: Booking[];
    timeslots: Timeslot[];
    refreshBookings: () => Promise<void>;
};

export type UseBookingActionsProps = {
    user: User | null;
    bookings: Booking[];
    refreshBookings: () => Promise<void>;
    setOpenBookDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setNewBooking: (value: NewBooking | null) => void;
    setDelBooking: (value: Booking | null) => void;
    bookingType: "GuestSuite" | "LaundryRoom";
};