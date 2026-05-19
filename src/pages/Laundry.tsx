import Calendar from "../components/LaundryPage/Calendar";
import { useEffect, useState, useCallback } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../api/laundry";
import type { Timeslot, Booking } from "../components/LaundryPage/Calendar";

export default function Laundry() {
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const currentUser = 1;

    const refreshBookings = useCallback(async () => {
        const data = await fetchBookedSlots();
        setBookings(data);
    }, []);

    useEffect(() => {
        fetchLaundrySlots().then(setTimeslots);
    }, []);

    useEffect(() => {
        refreshBookings();
    }, []);

    return (
        <Calendar
            bookings={bookings}
            timeslots={timeslots}
            currentUser={currentUser}
            refreshBookings={refreshBookings}
        />
    );
}