import { useState, useEffect } from "react";
import { useCalendarDays } from "./useCalendarDays";

import type { EventInput } from "@fullcalendar/core";
import type { User } from "@supabase/supabase-js";
import type { Booking } from "../types/booking";

export function useGuestSuiteEvents(bookings: Booking[], user: User | null, loading: boolean) {

    const [events, setEvents] = useState<EventInput[]>([]);
    const [isBuilding, setIsBuilding] = useState(true);

    // Create an array containing every date for 1 year
    const days = useCalendarDays(365);

    useEffect(() => {
        if (loading || !user || !Array.isArray(bookings)) return;

        const build = () => {

            //Loading
            setIsBuilding(true);

            //Building
            const result: EventInput[] = [];

            // Loop through each date
            days.forEach(date => {
                const booking = bookings.find(b => b.date === date);

                if (booking) {
                    // Check if there is a booking and who booked it.
                    const isOwner = booking.user_id === user.id;

                    result.push({
                        id: String(booking.id),
                        title: isOwner ? "Bokad" : "Upptaget",
                        start: date,
                        allDay: true,
                        extendedProps: {
                            date,
                            isOwner,
                            isAvailable: false
                        }
                    });
                } else {
                    // If there is no booking.
                    result.push({
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
            setEvents(result);

            //Loading off
            setIsBuilding(false);
        };

        build();

    }, [bookings, user, loading, days]);

    return { events, isBuilding };
}