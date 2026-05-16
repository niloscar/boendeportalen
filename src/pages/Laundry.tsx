import Calendar from "../components/Calendar";
import { useEffect, useState } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../../api/laundry";
import type { Timeslot, Booking } from "../components/Calendar";

export default function Laundry() {
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const currentUser = 1;

    useEffect(() => {
        fetchLaundrySlots().then(setTimeslots);
    }, []);

    useEffect(() => {
        fetchBookedSlots().then(setBookings);
    }, []);

    return (
        <Calendar
            bookings={bookings}
            timeslots={timeslots}
            currentUser={currentUser}
        />
    );
}