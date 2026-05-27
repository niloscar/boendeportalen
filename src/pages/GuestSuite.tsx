import GuestSuiteCalendar from "../components/bookings/GuestSuiteCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/booking";
import AlertDialog from "../components/ui/AlertDialog";
import GuestSuiteInfo from "../components/bookings/GuestSuiteInfo";
import { BuildingApartmentIcon } from "@phosphor-icons/react";

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
        <div>
            <div className="h-screen">
                <div className="flex w-full flex-col items-center gap-6">
                    <h1 className="text-3xl md:text-5xl font-bold">Bokning av gästlägenheten</h1 >
                    <div className="mb-6 text-gray-600 text-center">
                        Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. <br />
                        <a href="" onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }} className="text-green-500 hover:text-green-700">Här</a> hittar du all viktig information inför din bokning.
                    </div>
                </div>

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
                title=
                {<div className="flex items-center gap-2">
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500' aria-hidden='true'>
                        <BuildingApartmentIcon size={20} weight='fill' className='text-white' />
                    </div>
                    <span>Gästlägenhet - Bokningsinformation</span>
                </div>}
                message={<GuestSuiteInfo />}
                onConfirm={() => { setOpenAlertDialog(false); }}
                confirmColor="primary"
            />
        </div >
    );
}