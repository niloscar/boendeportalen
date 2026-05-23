import { useState, useEffect, useMemo } from "react";

import type { EventInput, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";

import useAuth from "../../hooks/useAuth";
import { useBookingActions } from "../../hooks/useBookingActions";
import type { NewBooking, Booking, GuestSuiteCalendarProps } from "../../types/booking";
import ConfirmDialog from "../ui/ConfirmDialog";
import AlertDialog from "../ui/AlertDialog";
import LoadingSkeleton from "./LoadingSkeleton";

export default function GuestSuiteCalendar({ bookings, refreshBookings }: GuestSuiteCalendarProps) {

    // States

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>("");
    const [openBookDialog, setOpenBookDialog] = useState<boolean>(false);
    const [bookDialogMessage, setBookDialogMessage] = useState<string>("");
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [alertDialogMessage, setAlertDialogMessage] = useState<string>("");

    const [delBooking, setDelBooking] = useState<Booking | null>(null);
    const [newBooking, setNewBooking] = useState<NewBooking | null>(null);

    // Will hold all events to be displayed in calendar
    const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

    //Loading state
        const [isBuildingEvents, setIsBuildingEvents] = useState(true);
    
    //Auth
    const { user, loading } = useAuth()

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

    // useEffect to render all calendar events
    useEffect(() => {

        if (loading || !user) return;

        const buildEvents = async () => {

            //Loading
            setIsBuildingEvents(true);

            //Building
            const events: EventInput[] = [];

            // Create an array containing every date for 1 year
            const days: string[] = [];
            for (let i = 0; i <= 365; i++) {
                const d = new Date();
                d.setDate(today.getDate() + i);
                days.push(d.toISOString().split("T")[0]);
            }

            // Loop through each date
            days.forEach((date) => {
                const booking = bookings.find((b) => b.date === date);

                if (booking) {
                    // Check if there is a booking and who booked it.
                    const isOwner = booking.user === user.id;

                    events.push({
                        id: String(booking.id),
                        title: isOwner ? "Bokad" : "Upptaget",
                        start: date, // ingen tid → hela dagen
                        allDay: true,
                        extendedProps: {
                            user: isOwner ? booking.user : null,
                            date,
                            isOwner,
                            isAvailable: false
                        }
                    });
                } else {
                    // If there is no booking.
                    events.push({
                        id: `free-${date}`,
                        title: "Ledig",
                        start: date,
                        allDay: true,
                        extendedProps: {
                            date,
                            isOwner: false,
                            isAvailable: true
                        }
                    });
                }
            });

            //Update state that holds events
            setCalendarEvents(events);

            //Loading off
            setIsBuildingEvents(false);
        };

        buildEvents();
    }, [bookings, user, loading, today]);


    // Handles click on events
    const handleEventClick = (e: EventClickArg) => {

        const props = e.event.extendedProps;
        const isOwner = props.isOwner;

        //Wait for user info
        if (loading || !user) {
            return null; // eller en spinner
        }

        // If slot is available
        if (props.isAvailable) {

            const userBookings = bookings.filter(b => b.user === user.id);

            // Prevent user from booking more than 5 dates
            if (userBookings.length >= 5) {
                //Set message and show pop-up dialog
                setAlertDialogMessage(`Du har redan fem aktiva bokningar. Avboka ett datum för att kunna boka ett nytt.`);
                setOpenAlertDialog(true);
                return;
            }

            //Set message and show pop-up dialog
            setBookDialogMessage(`Vill du boka ${props.date}?\n\nTänk på att du endast kan ha 5 aktiva bokningar åt gången.`);
            setOpenBookDialog(true);

            //Prepare data for new booking
            setNewBooking({ date: props.date, slot: null, user: user.id });
            return;
        }

        // If slot is booked by someone else
        if (!isOwner) {
            e.jsEvent.preventDefault();
            return;
        }

        //If slot is booked by the logged in user 
        if (isOwner) {

            //Set message and show pop-up dialog
            setDeleteDialogMessage(`Vill du ta bort bokningen för\n${props.date}?\n\nDen här åtgärden går inte att ångra.`);
            setOpenDeleteDialog(true);

            //Prepare data for deletion
            setDelBooking({ id: Number(e.event.id), date: props.date, slot: null, user: user.id });
        }
    };

    async function handleAlertConfirm() {
        //Cleanup
        setOpenAlertDialog(false);
        setAlertDialogMessage("");
    }

    //Render skeleton if loading
    if (isBuildingEvents) {
        return (<LoadingSkeleton />);
    }

    return (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "today",
                    center: "title",
                    right: "prev,next"
                }}
                events={calendarEvents}
                eventClassNames={(arg) => {
                    const { isOwner, isAvailable } = arg.event.extendedProps;

                    if (isAvailable) {
                        return "!bg-neutral-200 hover:!bg-green-300 transition duration-200 !border-0 !rounded-sm p-6 !text-gray-700 !cursor-pointer !h-full flex items-center px-2";
                    }

                    if (isOwner) {
                        return "!bg-green-500 hover:!bg-green-700 transition duration-200 !border-0 !rounded-sm p-6 !text-white !cursor-pointer !h-full flex items-center px-2";
                    }

                    return "!bg-neutral-100 !border-0 !rounded-sm p-6 !text-neutral-100 !pointer-events-none !h-full flex items-center px-2";
                }}
                eventContent={(arg) => {
                    const { isAvailable, isOwner } = arg.event.extendedProps;

                    let textColor = "text-gray-700"; // default för lediga
                    if (isOwner) textColor = "text-white cursor-pointer";
                    if (!isAvailable && !isOwner) textColor = "text-neutral-500";

                    return {
                        html: `<div class="w-full ${textColor}">${arg.event.title}</div>`
                    };
                }}
                eventClick={handleEventClick}
                firstDay={1}
                locale={svLocale}
                allDaySlot={true}
                height="auto"
                validRange={{
                    start: today.toISOString().split("T")[0],
                    end: calMaxDate.toISOString().split("T")[0]
                }}
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

            <AlertDialog
                open={openAlertDialog}
                title="Information"
                message={alertDialogMessage}
                onConfirm={handleAlertConfirm}
                confirmColor="green"
            />
        </div>
    );
}