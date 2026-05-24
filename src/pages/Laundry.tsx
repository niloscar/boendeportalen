import LaundryRoomCalendar from "../components/ManageBookings/LaundryRoomCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../api/laundryRoom";
import type { Timeslot, Booking } from "../types/booking";
import LaundryRoomInfo from "../components/ManageBookings/LaundryRoomInfo";
import AlertDialog from "../components/ui/AlertDialog";

export default function Laundry() {

    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
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
            <h1 className="text-3xl mb-6">Bokning av tvättstugan</h1 >
            <div className="mb-6">Välkommen att boka tid i tvättstugan. Genom att följa <a href="" onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }} className="text-green-500 hover:text-green-700">reglerna</a> hjälper du till att hålla tvättstugan trivsam och tillgänglig för alla i föreningen.</div>
            <LaundryRoomCalendar
                bookings={bookings}
                timeslots={timeslots}
                refreshBookings={refreshBookings}
            />
            <AlertDialog
                open={openAlertDialog}
                title="🧺 Tvättstuga - Bokningsinformation"
                message={<LaundryRoomInfo />}
                onConfirm={() => { setOpenAlertDialog(false); }}
                confirmColor="green"
            />
        </>
    );
}