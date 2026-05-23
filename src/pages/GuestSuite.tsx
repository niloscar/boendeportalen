import GuestSuiteCalendar from "../components/ManageBookings/GuestSuiteCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/booking";

export default function GuestSuite() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshBookings: () => Promise<void> = useCallback(async () => {
        const data = await fetchBookedSlots();
        setBookings(data);
    }, []);

    useEffect(() => {
        (async () => {
            await refreshBookings();
        })();
    }, [refreshBookings]);

    return (
        <GuestSuiteCalendar
            bookings={bookings}
            refreshBookings={refreshBookings}
        />
    );
}