import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import svLocale from "@fullcalendar/core/locales/sv";
import { deleteBooking, createBooking } from "../../../api/laundry";
import ConfirmDialog from "./ConfirmDialog";

// Types -----------------------------

export type Booking = {
    id: number;
    date: string;
    slot: number;
    user: number;
};

export type CurrentBooking = {
    id: number | null;
    date: string | null;
    slot: number | null;
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

export default function Calendar({
    bookings,
    timeslots,
    currentUser,
    refreshBookings
}: CalendarProps) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState("");
    const [openBookDialog, setOpenBookDialog] = useState(false);
    const [bookDialogMessage, setBookDialogMessage] = useState("");

    const [currentBooking, setCurrentBooking] = useState<CurrentBooking>({
        id: null,
        slot: null,
        date: null
    });

    const [newBooking, setNewBooking] = useState<NewBooking>({
        user: currentUser,
        slot: null,
        date: null
    });

    const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

    // Defines a 30 day window for the calendar.
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    // ⭐ useEffect som ersätter ALL render-logik
    useEffect(() => {
        const events: EventInput[] = [];

        // 1. Sätt currentBooking baserat på användarens bokning
        const ownerBooking = bookings.find(b => b.user === currentUser);

        if (ownerBooking) {
            setCurrentBooking({
                id: ownerBooking.id,
                slot: ownerBooking.slot,
                date: ownerBooking.date
            });
        } else {
            setCurrentBooking({ id:null, slot: null, date: null });
        }

        // 2. Lägg till bokade slots
        bookings.forEach((booking) => {
            const slot = timeslots.find((s) => s.id === booking.slot);
            if (!slot) return;

            const isOwner = booking.user === currentUser;

            events.push({
                id: String(booking.id),
                title: isOwner
                    ? `${slot.start}-${slot.end} Bokad`
                    : `${slot.start}-${slot.end} Upptaget`,
                start: `${booking.date}T${slot.start}`,
                end: `${booking.date}T${slot.end}`,
                extendedProps: {
                    user: booking.user,
                    slot: booking.slot,
                    isOwner,
                    isAvailable: false
                }
            });
        });

        // 3. Generera alla dagar i 30-dagarsfönstret
        const days: string[] = [];
        for (let i = 0; i <= 30; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            days.push(d.toISOString().split("T")[0]);
        }

        // 4. Lägg till lediga slots
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
                            slot: slot.id,
                            date,
                            isOwner: false,
                            isAvailable: true
                        }
                    });
                }
            });
        });

        // 5. Uppdatera state EN gång
        setCalendarEvents(events);

    }, [bookings, timeslots, currentUser]);

    // Handles click on date
    const handleDateClick = (e: DateClickArg) => {
        const clicked = new Date(e.dateStr);

        if (clicked > maxDate) {
            alert("Du kan bara boka upp till 30 dagar framåt");
            return;
        }
    };

    // Handles click on booking
    const handleEventClick = (e: EventClickArg) => {
        const props = e.event.extendedProps;
        const isOwner = props.isOwner;

        // If slot is available
        if (props.isAvailable) {
            setBookDialogMessage(
                `Vill du boka tid ${timeslots[props.slot - 1].start}-${timeslots[props.slot - 1].end} ${props.date}. Tänk på att du endast kan ha en aktiv bokning. Tidigare bokningar kommer att ersättas.`
            );
            setOpenBookDialog(true);
            setNewBooking({ user: currentUser, slot: props.slot, date: props.date });
            return;
        }

        // If slot is booked by someone else
        if (!isOwner) {
            e.jsEvent.preventDefault();
            return;
        }

        const timestamp = e.event.start;
        const date = new Date(timestamp).toLocaleDateString("sv-SE");

        setDeleteDialogMessage(
            `Ta bort bokning? ${timeslots[props.slot - 1].start}-${timeslots[props.slot - 1].end} ${date}. Den här åtgärden går inte att ångra.`
        );

        setOpenDeleteDialog(true);
        setCurrentBooking({ id:e.event.id, slot: props.slot, date: props.date });
    };

    async function handleDelete() {
        console.log(currentBooking.id)
        const result = await deleteBooking(currentBooking.id);
        console.log(result);
        setOpenDeleteDialog(false);
        await refreshBookings();
    }

    async function handleBook() {
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
                dateClick={handleDateClick}
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
                    end: maxDate.toISOString().split("T")[0]
                }}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Ta bort bokning?"
                message={deleteDialogMessage}
                onConfirm={handleDelete}
                onCancel={() => setOpenDeleteDialog(false)}
            />

            <ConfirmDialog
                open={openBookDialog}
                title="Vill du boka?"
                message={bookDialogMessage}
                onConfirm={handleBook}
                onCancel={() => setOpenBookDialog(false)}
            />
        </div>
    );
}
