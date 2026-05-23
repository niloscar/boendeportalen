import LaundryRoomCalendar from "../components/ManageBookings/LaundryRoomCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../api/laundryRoom";
import type { Timeslot, Booking } from "../types/booking";

export default function Laundry() {
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshBookings: () => Promise<void> = useCallback(async () => {
        const data = await fetchBookedSlots();
        setBookings(data);
    }, []);

    useEffect(() => {
        fetchLaundrySlots().then(setTimeslots);
    }, []);

    useEffect(() => {
        (async () => {
            await refreshBookings();
        })();
    }, [refreshBookings]);

    return (
        <LaundryRoomCalendar
            bookings={bookings}
            timeslots={timeslots}
            refreshBookings={refreshBookings}
        />
    );
}