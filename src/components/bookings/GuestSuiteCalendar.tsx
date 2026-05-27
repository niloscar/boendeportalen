import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import type { EventInput, EventClickArg, CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";

import type { NewBooking, Booking, GuestSuiteCalendarProps, MyExtendedProps } from "../../types/booking";
import useAuth from "../../hooks/useAuth";
import { useBookingActions } from "../../hooks/useBookingActions";
import { useGuestSuiteEvents } from "../../hooks/useGuestSuiteEvents";
import { useBookingIndicator } from "../../hooks/useBookingIndicator";
import GuestSuiteCalendarView from "./GuestSuiteCalendarView";
import LoadingSkeleton from "./LoadingSkeleton";
import ConfirmDialog from "../ui/ConfirmDialog";
import AlertDialog from "../ui/AlertDialog";
import { handleGuestSuiteEventClick } from "../../utils/handleBookingEvents";

export default function GuestSuiteCalendar({ bookings, refreshBookings }: GuestSuiteCalendarProps) {

    // States and variabels - - - - - - - - - - - - - - 

    //For UI
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>("");
    const [openBookDialog, setOpenBookDialog] = useState<boolean>(false);
    const [bookDialogMessage, setBookDialogMessage] = useState<string>("");
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [alertDialogMessage, setAlertDialogMessage] = useState<string>("");
    const [delBooking, setDelBooking] = useState<Booking | null>(null);
    const [newBooking, setNewBooking] = useState<NewBooking | null>(null);

    //For DOM
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [currentIndex, setCurrentIndex] = useState(0);

    //Auth
    const { user, loading } = useAuth()

    //Handle window resizing
    const calendarRef = useRef<FullCalendar | null>(null);

    // Defines a 365 day window for the calendar.
    const today = useMemo(() => new Date(), []);
    const calMaxDate = new Date();
    calMaxDate.setDate(today.getDate() + 365);

    //Defines what type of booking
    const bookingType: "GuestSuite" | "LaundryRoom" = "GuestSuite";

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

    // Effects - - - - - - - - - - - - - - 

    // Checks screen-width
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Controls calendar view based on screen-width
    useEffect(() => {
        const api: CalendarApi | undefined = calendarRef.current?.getApi();
        if (!api) return;

        api.changeView(isMobile ? "listWeek" : "dayGridMonth");
    }, [isMobile]);


    // Render all calendar events - - - - - - - - - - - - - -
    // calendarEvents: Will hold all events to be displayed in calendar
    // isBuildingEvents: Loading state

    const { events: calendarEvents, isBuilding: isBuildingEvents } =
        useGuestSuiteEvents(bookings, user, loading);

    // Render "My bookings" buttons - - - - - - - - - - - - - -
    // Fetch and sort my bookings

    const myEvents = (calendarEvents as (EventInput & { extendedProps?: MyExtendedProps })[])
        .filter(e => e.extendedProps?.isOwner)
        .sort((a, b) => {
            const da = new Date(a.start as string).getTime();
            const db = new Date(b.start as string).getTime();
            return da - db;
        });

    //Go to booking in calendar by id and useRef
    const goToBooking = useCallback((index: number) => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        const event = myEvents[index];
        if (!event) return;

        api.gotoDate(event.start as string);
        setCurrentIndex(index);
    }, [myEvents, calendarRef]);

    // Render "My bookings" indicator
    const { handleViewDidMount } = useBookingIndicator({
        myEvents,
        currentIndex,
        goToBooking
    });

    // Handles click on events
    const handleEventClick = (e: EventClickArg) =>
        handleGuestSuiteEventClick({
            e,
            user,
            loading,
            bookings,
            setAlertDialogMessage,
            setOpenAlertDialog,
            setBookDialogMessage,
            setOpenBookDialog,
            setNewBooking,
            setDeleteDialogMessage,
            setOpenDeleteDialog,
            setDelBooking
        });

    async function handleAlertConfirm() {
        //Cleanup
        setOpenAlertDialog(false);
        setAlertDialogMessage("");
    }

    //Render skeleton if loading
    if (isBuildingEvents || loading) {
        return (<LoadingSkeleton />);
    }

    return (
        <div>
            <div id="parent" className="flex justify-center pb-8"></div>
            <GuestSuiteCalendarView
                calendarRef={calendarRef}
                calendarEvents={calendarEvents}
                today={today}
                calMaxDate={calMaxDate}
                handleEventClick={handleEventClick}
                handleViewDidMount={handleViewDidMount}
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
                confirmColor="primary"
            />

            <AlertDialog
                open={openAlertDialog}
                title="Information"
                message={alertDialogMessage}
                onConfirm={handleAlertConfirm}
                confirmColor="primary"
            />
        </div>
    );
}