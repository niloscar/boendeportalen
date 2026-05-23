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
        <>
            <h1 class="text-5xl p-6">Bokning av tvättstugan</h1 >
            <div class="p-6">Välkommen att boka tid i tvättstugan. För att alla hyresgäster ska ha möjlighet att tvätta på ett rättvist sätt gäller följande regler:

                <ul class="list-disc list-inside text-gray-700 p-0"><li>Du kan endast ha en aktiv bokning åt gången.</li>

                    <li>Det går att boka max en månad i förväg.</li>

                    <li>Bokningen är personlig och får inte överlåtas.</li>

                    <li>Se till att städa och lämna tvättstugan i gott skick efter användning.</li></ul>

                Genom att följa reglerna hjälper du till att hålla tvättstugan trivsam och tillgänglig för alla i föreningen.
            </div>
            <LaundryRoomCalendar
                bookings={bookings}
                timeslots={timeslots}
                refreshBookings={refreshBookings}
            />
        </>
    );
}