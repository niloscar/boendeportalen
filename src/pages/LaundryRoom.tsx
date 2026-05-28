import { useEffect, useState, useCallback } from "react";
import { fetchLaundrySlots, fetchBookedSlots } from "../api/laundryRoom";
import type { Timeslot, Booking } from "../types/booking";
import LaundryRoomCalendar from "../components/bookings/LaundryRoomCalendar";
import LaundryRoomInfo from "../components/bookings/LaundryRoomInfo";
import AlertDialog from "../components/ui/AlertDialog";
import { WashingMachineIcon } from "@phosphor-icons/react";
import { useFeatures } from '../hooks/useFeatures'
import { Navigate } from "react-router-dom";

export default function Laundry() {

    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const { isFeatureEnabled } = useFeatures()

    useEffect(() => {
        (async () => {
            const result = await fetchLaundrySlots();

            if (!result.success) {
                setErrorMessage(result.error ?? "Kunde inte hämta tidsluckor");
                return;
            }

            setTimeslots(result.data);
        })();
    }, []);


    const refreshBookings = useCallback(async () => {
        const result = await fetchBookedSlots();

        if (!result.success) {
            setErrorMessage(result.error ?? "Kunde inte hämta bokningar");
            return;
        }

        setBookings(result.data);
    }, []);

    useEffect(() => {
        (async () => {
            const result = await fetchBookedSlots();

            if (!result.success) {
                setErrorMessage(result.error ?? "Kunde inte hämta bokningar");
                return;
            }

            setBookings(result.data);
        })();
    }, []);

    if (!isFeatureEnabled('tvattstuga')) {
        return <Navigate to="/" replace />;
    }

    return (

        <div>
            <div className="flex w-full flex-col items-center gap-6">
                <h1 className="text-3xl md:text-5xl font-bold">Bokning av tvättstugan</h1 >
                <div className="mb-6 text-gray-600 text-center pb-6">
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
                title={
                    <div className="flex items-center gap-2">
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500' aria-hidden='true'>
                            <WashingMachineIcon size={20} weight='fill' className='text-white' />
                        </div>
                        <span>Tvättstuga - Bokningsinformation</span>
                    </div>
                }
                message={<LaundryRoomInfo />}
                onConfirm={() => { setOpenAlertDialog(false); }}
                confirmColor="primary"
            />
        </div>
    );
}
