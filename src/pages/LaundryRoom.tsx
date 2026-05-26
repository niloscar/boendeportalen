import LaundryRoomCalendar from "../components/bookings/LaundryRoomCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../api/laundryRoom";
import type { Timeslot, Booking } from "../types/booking";
import LaundryRoomInfo from "../components/bookings/LaundryRoomInfo";
import AlertDialog from "../components/ui/AlertDialog";

export default function Laundry() {

    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshBookings = useCallback(async () => {
        const result = await fetchBookedSlots();

        if (!result.success) {
            setErrorMessage(result.error ?? "Kunde inte hämta bokningar");
            return;
        }

        // ✔ TS vet att data finns här
        setBookings(result.data);
    }, []);

    useEffect(() => {
        (async () => {
            const result = await fetchLaundrySlots();

            if (!result.success) {
                setErrorMessage(result.error ?? "Kunde inte hämta tidsluckor");
                return;
            }

            // ✔ TS vet att data finns här
            setTimeslots(result.data);
        })();
    }, []);

    useEffect(() => {
        refreshBookings(); // ✔ korrekt
    }, [refreshBookings]);

    return (
        <div className='w-full text-neutral-900'>
            <main className='mx-auto flex w-full flex-col gap-8'>
                <h1 className="text-3xl mb-6">Bokning av tvättstugan</h1 >
                <div className="mb-6">
                    Välkommen att boka tid i tvättstugan. Genom att följa{" "}
                    <a
                        href=""
                        onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }}
                        className="text-green-500 hover:text-green-700"
                    >
                        reglerna
                    </a>{" "}
                    hjälper du till att hålla tvättstugan trivsam och tillgänglig för alla i föreningen.
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4">
                        {errorMessage}
                    </div>
                )}

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
            </main>
        </div>
    );
}
