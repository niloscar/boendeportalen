import { useState, useEffect, useRef, useMemo } from "react";

import type { EventClickArg, CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";

import useAuth from "../../hooks/useAuth";
import { useBookingActions } from "../../hooks/useBookingActions";
import { useLaundryRoomEvents } from "../../hooks/useLaundryRoomEvents";
import type { NewBooking, Booking, LaundryRoomCalendarProps } from "../../types/booking";
import LaundryRoomCalendarView from "./LaundryRoomCalendarView";
import ConfirmDialog from "../ui/ConfirmDialog";
import LoadingSkeleton from "./LoadingSkeleton";
import { handleLaundryRoomEventClicks } from "../../utils/handleBookingEvents";

export default function LaundryRoomCalendar({ bookings, timeslots, refreshBookings }: LaundryRoomCalendarProps) {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // States
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>("");
    const [openBookDialog, setOpenBookDialog] = useState<boolean>(false);
    const [bookDialogMessage, setBookDialogMessage] = useState<string>("");

    const [delBooking, setDelBooking] = useState<Booking | null>(null);
    const [newBooking, setNewBooking] = useState<NewBooking | null>(null);

    //Auth
    const { user, loading } = useAuth()

    //Handle window resizing
    const calendarRef = useRef<FullCalendar | null>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // sätt initialt värde
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const api: CalendarApi | undefined = calendarRef.current?.getApi();
        if (!api) return;

        api.changeView(isMobile ? "listWeek" : "timeGridWeek");
    }, [isMobile]);

    // Defines a 30 day window for the calendar.
    const today = useMemo(() => new Date(), []);
    const calMaxDate = new Date();
    calMaxDate.setDate(today.getDate() + 30);

    //Defines what type of booking
    const bookingType: "GuestSuite" | "LaundryRoom" = "LaundryRoom";

    const {
        createNewBooking,
        deleteExistingBooking,
        isProcessing
    } = useBookingActions({
        user,
        bookings,
        refreshBookings,
        setOpenBookDialog,
        setOpenDeleteDialog,
        setNewBooking,
        setDelBooking,
        bookingType
    });

    // Render all calendar events - - - - - - - - - - - - - -
    // calendarEvents: Will hold all events to be displayed in calendar
    // isBuildingEvents: Loading state
    const { events: calendarEvents, isBuilding: isBuildingEvents } =
        useLaundryRoomEvents(bookings, timeslots, user, loading);

    // Handles click on events
    const handleEventClick = (e: EventClickArg) =>
        handleLaundryRoomEventClicks({
            e,
            user,
            loading,
            timeslots,
            setBookDialogMessage,
            setOpenBookDialog,
            setNewBooking,
            setDeleteDialogMessage,
            setOpenDeleteDialog,
            setDelBooking
        });

    //Render skeleton if loading
    if (isBuildingEvents || loading) {
        return (<LoadingSkeleton />);
    }

    return (
        <div>
            <LaundryRoomCalendarView
                calendarRef={calendarRef}
                calendarEvents={calendarEvents}
                today={today}
                calMaxDate={calMaxDate}
                handleEventClick={handleEventClick}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Radera bokning"
                message={deleteDialogMessage}
                isProcessing={isProcessing}
                onConfirm={async () => { await deleteExistingBooking(delBooking); }}
                onCancel={() => {
                    setOpenDeleteDialog(false);
                    setDelBooking(null);
                }}
                confirmColor="red"
            />

            <ConfirmDialog
                open={openBookDialog}
                title="Bekräfta bokning"
                message={bookDialogMessage}
                isProcessing={isProcessing}
                onConfirm={async () => { await createNewBooking(newBooking); }}
                onCancel={() => {
                    setOpenBookDialog(false);
                    setNewBooking(null);
                }}
                confirmColor="green"
            />
        </div>
    );
}