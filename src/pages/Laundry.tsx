import Calendar from "../components/Calendar";
import { useEffect, useState } from "react";
import { fetchLaundrySlots } from "../../api/laundry";

export default function Laundry() {
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);


    const bookings = [
        { id: "1", user: "Sofie", date: "2026-05-15", slot: 1 },
        { id: "2", user: "Alex", date: "2026-05-15", slot: 3 }
    ];


    useEffect(() => {
        fetchLaundrySlots().then(setTimeslots);
    }, []);


    return (
        <Calendar
            bookings={bookings}
            timeslots={timeslots}
            currentUser="Sofie"
        />
    );
}