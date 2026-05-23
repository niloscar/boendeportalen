import { useState, useEffect, useMemo } from "react";

import type { EventInput, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";
import { Skeleton, Box } from "@mui/material";

import useAuth from "../../hooks/useAuth";
import { useBookingActions } from "../../hooks/useBookingActions";
import type { NewBooking, Booking, LaundryRoomCalendarProps } from "../../types/booking";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function Calendar({ bookings, timeslots, refreshBookings }: LaundryRoomCalendarProps) {

    // States
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>("");
    const [openBookDialog, setOpenBookDialog] = useState<boolean>(false);
    const [bookDialogMessage, setBookDialogMessage] = useState<string>("");

    const [delBooking, setDelBooking] = useState<Booking | null>(null);
    const [newBooking, setNewBooking] = useState<NewBooking | null>(null);

    // Will hold all events to be displayed in calendar
    const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

    //Loading state
    const [isBuildingEvents, setIsBuildingEvents] = useState(true);

    //Auth
    const { user, loading } = useAuth()

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


    // useEffect to render all calendar events
    useEffect(() => {

        if (loading || !user) return;

        const buildEvents = async () => {
            
            //Loading
            setIsBuildingEvents(true);

            //Building
            const events: EventInput[] = [];

            //Loop through bookings
            bookings.forEach((booking) => {

                const slot = timeslots?.find((s) => s.id === booking.slot);

                if (!slot) return;

                const isOwner = booking.user === user.id;
                console.log(booking.user)
                console.log(user.id)

                // Add bookings to the events array
                events.push({
                    id: String(booking.id),
                    title: isOwner
                        ? `${slot.start}-${slot.end} Bokad`
                        : `${slot.start}-${slot.end} Upptaget`,
                    start: `${booking.date}T${slot.start}`,
                    end: `${booking.date}T${slot.end}`,
                    extendedProps: {
                        user: isOwner
                            ? booking.user
                            : null,
                        date: booking.date,
                        slot: booking.slot,
                        isOwner: isOwner,
                        isAvailable: false
                    }
                });
            });

            // Loop through every date of the 30 day timeframe and add them to an array
            const days: string[] = [];
            for (let i = 0; i <= 30; i++) {
                const d = new Date();
                d.setDate(today.getDate() + i);
                days.push(d.toISOString().split("T")[0]);
            }

            // Fill up events array with "available slots" for every slot that isn't already booked
            days.forEach((date) => {

                timeslots.forEach((slot) => {
                    const isBooked = bookings.some(
                        (b) => b.date === date && b.slot === slot.id
                    );

                    if (!isBooked) {
                        events.push({
                            id: `free-${date}-${slot.id}`,
                            title: `${slot.start}-${slot.end} Ledig`,
                            start: `${date}T${slot.start}`,
                            end: `${date}T${slot.end}`,
                            extendedProps: {
                                date: date,
                                slot: slot.id,
                                isOwner: false,
                                isAvailable: true
                            }
                        });
                    }
                });
            });

            //Update state that holds events
            setCalendarEvents(events);

            //Loading off
            setIsBuildingEvents(false);
        };

        buildEvents();
    }, [bookings, timeslots, user, loading, today]);

    // Handles click on events
    const handleEventClick = (e: EventClickArg) => {

        const props = e.event.extendedProps;
        const isOwner = props.isOwner;
        const slot = timeslots?.find(s => s.id === props.slot);

        //Wait for user info
        if (loading || !user) {
            return null; // eller en spinner
        }

        // If slot is available
        if (props.isAvailable) {

            //Set message and show pop-up dialog
            setBookDialogMessage(`Vill du boka ${props.date} ${slot?.start}-${slot?.end}?\n\nTänk på att du endast kan ha EN aktiv bokning åt gången och att tidigare bokningar kommer att ersättas.`);
            setOpenBookDialog(true);

            //Prepare data for new booking
            setNewBooking({ date: props.date, slot: props.slot, user: user.id });
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
            setDeleteDialogMessage(`Vill du ta bort bokningen för\n${props.date} ${slot?.start}-${slot?.end}?\n\nDen här åtgärden går inte att ångra.`);
            setOpenDeleteDialog(true);

            //Prepare data for deletion
            setDelBooking({ id: Number(e.event.id), slot: props.slot, date: props.date, user: user.id });
        }
    };

    //Render skeleton if loading
    if (isBuildingEvents) {
        return (
            <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            </Box>
        );
    }

    return (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
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
                allDaySlot={false}
                slotDuration="01:00:00"
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
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
                onConfirm={async () => {await createNewBooking(newBooking);}}
                onCancel={() => {
                    setOpenBookDialog(false);
                    setNewBooking(null);
                }}
                confirmColor="green"
            />
        </div>
    );
}