import { useState, useEffect, useMemo } from "react";

import type { EventInput, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";

import { deleteBooking, createBooking } from "../../../api/laundry";
import ConfirmDialog from "./ConfirmDialog";


// Types -----------------------------

export type Booking = {
    id: number | null;
    date: string | null;
    slot: number | null;
    user: number;
};

export type NewBooking = {
    date: string | null;
    slot: number | null;
    user: number;
};

export type Timeslot = {
    id: number;
    start: string;
    end: string;
};

export type CalendarProps = {
    bookings: Booking[];
    timeslots: Timeslot[];
    currentUser: number;
    refreshBookings: () => void;
};

// Component -----------------------------

export default function Calendar({ bookings, timeslots, currentUser, refreshBookings }: CalendarProps) {

    // States

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>("");
    const [openBookDialog, setOpenBookDialog] = useState<boolean>(false);
    const [bookDialogMessage, setBookDialogMessage] = useState<string>("");

    const [delBooking, setDelBooking] = useState<Booking>({ 
        id: null,
        date: null,
        slot: null,
        user: 0
    });

    const [newBooking, setNewBooking] = useState<NewBooking>({
        date: null,
        slot: null,
        user: 0
    });

    // Will hold all events to be displayed in calendar
    const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

    // Defines a 30 day window for the calendar.
    const today = useMemo(() => new Date(), []);
    const calMaxDate = new Date();
    calMaxDate.setDate(today.getDate() + 30);

    // useEffect to render all calendar events
    useEffect(() => {

        const events: EventInput[] = [];

        //Loop through bookings
        bookings.forEach((booking) => {

            const slot = timeslots.find((s) => s.id === booking.slot);

            if (!slot) return;

            const isOwner = booking.user === currentUser;

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

    }, [bookings, timeslots, currentUser, today]);

    // Handles click on events
    const handleEventClick = (e: EventClickArg) => {

        const props = e.event.extendedProps;
        const isOwner = props.isOwner;

        // If slot is available
        if (props.isAvailable) {

            //Set message and show pop-up dialog
            setBookDialogMessage(`Vill du boka ${props.date} ${timeslots[props.slot - 1].start}-${timeslots[props.slot - 1].end}?\n\nTänk på att du endast kan ha EN aktiv bokning åt gången och att tidigare bokningar kommer att ersättas.`);
            setOpenBookDialog(true);

            //Prepare data for new booking
            setNewBooking({ date: props.date, slot: props.slot, user: currentUser });
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
            setDeleteDialogMessage(`Vill du ta bort bokningen för\n${props.date} ${timeslots[props.slot - 1].start}-${timeslots[props.slot - 1].end}?\n\nDen här åtgärden går inte att ångra.`);
            setOpenDeleteDialog(true);
            
            //Prepare data for deletion
            setDelBooking({ id: Number(e.event.id), slot: props.slot, date: props.date, user: currentUser });
        }
    };

    // Delete booking and close dialog, re-render calendar.
    async function handleDeleteBooking() {
        const result = await deleteBooking(delBooking.id);
        console.log(result);
        setOpenDeleteDialog(false);
        refreshBookings();
    }

    // Create booking and close dialog, re-render calendar.
    async function handleNewBooking() {
        const result = await createBooking(newBooking.user, newBooking.slot, newBooking.date);
        console.log(result);
        setOpenBookDialog(false);
        await refreshBookings();
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
                        return "!bg-green-50 !border !border-dashed !border-green-400 !text-green-700 !cursor-pointer !h-full flex items-center px-2";
                    }

                    if (isOwner) {
                        return "!bg-green-600 !text-white !h-full flex items-center px-2";
                    }

                    return "!bg-neutral-300 !text-neutral-500 !pointer-events-none !h-full flex items-center px-2";
                }}
                eventContent={(arg) => ({
                    html: `<div class="w-full">${arg.event.title}</div>`
                })}
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
                onConfirm={handleDeleteBooking}
                onCancel={() => {
                    setOpenDeleteDialog(false);
                    setDelBooking({ id:null, date: null, slot: null, user: 0 });
                }}
            />

            <ConfirmDialog
                open={openBookDialog}
                title="Bekräfta bokning"
                message={bookDialogMessage}
                onConfirm={handleNewBooking}
                onCancel={() => { 
                    setOpenBookDialog(false); 
                    setNewBooking({ date: null, slot: null, user: 0 });
                }}
            />
        </div>
    );
}