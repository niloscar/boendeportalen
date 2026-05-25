import Calendar from "../components/GuestSuitePage/Calendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/guestSuite";

export default function GuestSuite() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const currentUser = "f5df6173-92ec-45dd-bab3-b76feea2614d";

    const refreshBookings = useCallback(async () => {
        const data = await fetchBookedSlots();
        setBookings(data);
    }, []);

    useEffect(() => {
        (async () => {
            await refreshBookings();
        })();
    }, [refreshBookings]);

    return (
        <Calendar
            bookings={bookings}
            currentUser={currentUser}
            refreshBookings={refreshBookings}
        />
    );
}