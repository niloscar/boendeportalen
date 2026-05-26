import GuestSuiteCalendar from "../components/ManageBookings/GuestSuiteCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/booking";
import AlertDialog from "../components/ui/AlertDialog";
import GuestSuiteInfo from "../components/ManageBookings/GuestSuiteInfo";

export default function GuestSuite() {
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshBookings = useCallback(async () => {
        const result = await fetchBookedSlots();

        if (!result.success) {
            setErrorMessage(result.error ?? "Ett oväntat fel inträffade");
            return;
        }

        setBookings(result.data);
    }, []);

    useEffect(() => {
        refreshBookings();
    }, [refreshBookings]);

    return (
        <div className='w-full text-neutral-900'>
            <main className='mx-auto flex w-full flex-col gap-8 px-6 pt-6 pb-16 sm:px-10'>
                <div className="h-screen">
                    <h1 className="text-3xl mb-6">Bokning av gästlägenheten</h1>
                    <div className="mb-6">Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. <a href="" onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }} className="text-green-500 hover:text-green-700">Här</a> hittar du all viktig information inför din bokning.</div>
                    
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <GuestSuiteCalendar
                        bookings={bookings}
                        refreshBookings={refreshBookings}
                    />
                </div>

                <AlertDialog
                    open={openAlertDialog}
                    title="🏡 Gästlägenhet - Bokningsinformation"
                    message={<GuestSuiteInfo />}
                    onConfirm={() => { setOpenAlertDialog(false); }}
                    confirmColor="green"
                />
            </main>
        </div >
    );
}