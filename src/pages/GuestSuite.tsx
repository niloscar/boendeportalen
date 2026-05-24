import GuestSuiteCalendar from "../components/ManageBookings/GuestSuiteCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/booking";
import AlertDialog from "../components/ui/AlertDialog";
import GuestSuiteInfo from "../components/ManageBookings/GuestSuiteInfo";

export default function GuestSuite() {
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

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
        <>
            <div className="h-screen">
                <h1 className="text-3xl mb-6">Bokning av gästlägenheten</h1>
                <div className="mb-6">Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. <a href="" onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }} className="text-green-500 hover:text-green-700">Här</a> hittar du all viktig information inför din bokning.</div>
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
        </>
    );
}