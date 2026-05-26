import { useState, useEffect } from "react";
import { useCalendarDays } from "./useCalendarDays";

import type { EventInput } from "@fullcalendar/core";
import type { User } from "@supabase/supabase-js";
import type { Booking, Timeslot } from "../types/booking";

export function useLaundryRoomEvents(bookings: Booking[], timeslots: Timeslot[], user: User | null, loading: boolean) {

    const [events, setEvents] = useState<EventInput[]>([]);
    const [isBuilding, setIsBuilding] = useState(true);

    // Create an array containing every date for 30 days
    const days = useCalendarDays(30);

    useEffect(() => {
        if (loading || !user || !Array.isArray(bookings) || !Array.isArray(timeslots)) return;

        const build = () => {

            //Loading
            setIsBuilding(true);

            //Building
            const result: EventInput[] = [];

            //Loop through bookings and add to array
            bookings.forEach(booking => {
                const slot = timeslots.find(s => s.id === booking.slot);
                if (!slot) return;

                const isOwner = booking.user_id === user.id;

                result.push({
                    id: String(booking.id),
                    title: isOwner
                        ? `${slot.start}-${slot.end} Bokad`
                        : `${slot.start}-${slot.end} Upptaget`,
                    start: `${booking.date}T${slot.start}`,
                    end: `${booking.date}T${slot.end}`,
                    extendedProps: {
                        date: booking.date,
                        slot: booking.slot,
                        isOwner,
                        isAvailable: false
                    }
                });
            });

            // Fill up array with "available slots" for every slot that isn't already booked
            days.forEach(date => {
                timeslots.forEach(slot => {
                    const isBooked = bookings.some(
                        b => b.date === date && b.slot === slot.id
                    );

                    if (!isBooked) {
                        result.push({
                            id: `free-${date}-${slot.id}`,
                            title: `${slot.start}-${slot.end} Ledig`,
                            start: `${date}T${slot.start}`,
                            end: `${date}T${slot.end}`,
                            extendedProps: {
                                date,
                                slot: slot.id,
                                isOwner: false,
                                isAvailable: true
                            }
                        });
                    }
                });
            });

            //Update state that holds events
            setEvents(result);

            //Loading off
            setIsBuilding(false);
        };

        build();

    }, [bookings, user, timeslots, loading, days]);

    return { events, isBuilding };
}