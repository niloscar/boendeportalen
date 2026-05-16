import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";
import "./Calendar.css";

// Types -----------------------------

// Booking
export type Booking = {
    id: number;
    date: string;     // "2026-05-15"
    slot: number;     // slotid
    user: number;     // userId
};

// Timeslots
export type Timeslot = {
    id: number;
    start: string;    // "07:00"
    end: string;      // "10:00"
};

// Props till Calendar-komponenten
export type CalendarProps = {
    bookings: Booking[];
    timeslots: Timeslot[];
    currentUser: number;
};

// Component -----------------------------

export default function Calendar({ bookings = [], timeslots = [], currentUser }: CalendarProps) {
    
    // Defines a 30 day window for the calendar.
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    // Return an array containing every slot within the time period
    const renderCalEvents = (): EventInput[] => {

        const events: EventInput[] = [];

        // Loop through bookings and add them as "Booked slot" to the array
        bookings.forEach((booking) => {
            const slot = timeslots.find((s) => s.id === booking.slot);
            if (!slot) return;

            const isOwner = booking.user === currentUser;

            events.push({
                id: booking.id,
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
                },
                classNames: isOwner ? ["own-booking"] : ["busy-booking"]
            });
        });

        // Loop through every day of the timeframe
        const days: string[] = [];
        for (let i = 0; i <= 30; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            days.push(d.toISOString().split("T")[0]);
        }

        // Add "Available slot" events to the array for any remaining slot.
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
                        },
                        classNames: ["free-slot"]
                    });
                }
            });
        });

        return events;
    };


    // Handles click on date
    const handleDateClick = (e: any) => {

        const clicked = new Date(e.dateStr);

        // If date clicked is later than 30 day timeframe
        if (clicked > maxDate) {
            alert("Du kan bara boka upp till 30 dagar framåt");
            return;
        }

        // Show available slots
        const date = e.dateStr.split("T")[0];
        const bookedSlots = bookings
            .filter((booking) => booking.date === date)
            .map((booking) => booking.slot);

        const availableSlots = timeslots.filter(
            (s) => !bookedSlots.includes(s.id)
        );

        alert(
            "Lediga slots: " +
            availableSlots.map((s) => s.start + "-" + s.end).join(", ")
        );
    };

    // Handles click on booking
    const handleEventClick = (e: EventClickArg) => {

        const props = e.event.extendedProps;
        const isOwner = props.isOwner;

        // If slot is available
        if (props.isAvailable) {
            alert(`Boka slot ${props.slot} på ${props.date}`);
            return;
        }

        // If slot is booked by someone else, do nothing => handleDateClick will be called instead
        if (!isOwner) {
            e.jsEvent.preventDefault();
            return;
        }

        // If this is your booking:
        alert("Redigera din bokning: " + e.event.id);
    };

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
                events={renderCalEvents()}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                firstDay={1} // 1 = måndag
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
                eventContent={(e: any) => {
                    const isOwner = e.event.extendedProps.isOwner;

                    return {
                        html: 
                        `<div class="${isOwner ? "own-booking" : "unavailable-slot"}">
                            ${e.event.title}
                        </div>`
                    };
                }}
            />
        </div>
    );
}
