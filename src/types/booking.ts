import type { User } from '@supabase/supabase-js'
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import type FullCalendar from "@fullcalendar/react";

export type ApiSuccess<T> = {
    success: true;
    data: T;
};

export type ApiError = {
    success: false;
    error: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

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
    user_id: string;
};

export type BookingRow = {
    id: number;
    date: string;
    slot: number | null;
    user_id: string;
};

export type NewBooking = {
    date: string | null;
    slot: number | null;
    user_id: string;
};

export type MyExtendedProps = {
    isOwner?: boolean;
    slot?: number;
    date?: string;
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

export type GuestSuiteCalendarPropsBig = {
    calendarRef: React.RefObject<FullCalendar | null>;
    calendarEvents: EventInput[];
    today: Date;
    calMaxDate: Date;
    handleEventClick: (e: EventClickArg) => void;
    handleViewDidMount: () => void | null;
};

export type LaundryRoomCalendarPropsBig = {
    calendarRef: React.RefObject<FullCalendar | null>;
    calendarEvents: EventInput[];
    today: Date;
    calMaxDate: Date;
    handleEventClick: (e: EventClickArg) => void;
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

export type GuestSuiteEventParams = {
    e: EventClickArg;
    user: User | null;
    loading: boolean;
    bookings: Booking[];

    setAlertDialogMessage: (msg: string) => void;
    setOpenAlertDialog: (v: boolean) => void;

    setBookDialogMessage: (msg: string) => void;
    setOpenBookDialog: (v: boolean) => void;
    setNewBooking: (b: NewBooking | null) => void;

    setDeleteDialogMessage: (msg: string) => void;
    setOpenDeleteDialog: (v: boolean) => void;
    setDelBooking: (b: Booking | null) => void;
};

export type LaundryRoomEventParams = {
    e: EventClickArg;
    user: User | null;
    loading: boolean;
    timeslots: Timeslot[];

    setBookDialogMessage: (msg: string) => void;
    setOpenBookDialog: (v: boolean) => void;
    setNewBooking: (b: NewBooking | null) => void;

    setDeleteDialogMessage: (msg: string) => void;
    setOpenDeleteDialog: (v: boolean) => void;
    setDelBooking: (b: Booking | null) => void;
};

export type BookingIndicatorProps = {
    total: number;
    currentIndex: number;
    onSelect: (index: number) => void;
};

export type useBookingIndicatorProps = {
    myEvents: (EventInput & { extendedProps?: MyExtendedProps })[];
    currentIndex: number;
    goToBooking: (index: number) => void;
};