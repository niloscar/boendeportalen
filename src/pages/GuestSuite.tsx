import GuestSuiteCalendar from "../components/ManageBookings/GuestSuiteCalendar";
import { useEffect, useState, useCallback } from "react";
import { fetchBookedSlots } from "../api/guestSuite";
import type { Booking } from "../types/booking";
import AlertDialog from "../components/ui/AlertDialog";

export default function GuestSuite() {
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [alertDialogMessage, setAlertDialogMessage] = useState<string>("");

    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshBookings: () => Promise<void> = useCallback(async () => {
        const data = await fetchBookedSlots();
        setBookings(data);
        setAlertDialogMessage(`Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. Nedan hittar du all viktig information inför din bokning.

            <h3 class="text-xl mb-2">💰 Pris och betalning</h3><ul class="list-disc list-inside text-gray-700 p-0"><li>Kostnaden är 200 kr per natt.</li><li>Avgiften läggs automatiskt på din nästa hyresavi.</li></ul>
            <h3 class="text-xl mb-2">📅 Bokningsregler</h3><p>För att alla hyresgäster ska ha möjlighet att nyttja gästlägenheten gäller följande:</p><ul class="list-disc list-inside text-gray-700 m-2 p-0"><li>Du kan ha max 5 aktiva bokningar åt gången.</li><li>Det går att boka upp till ett år framåt i tiden.</li><li>Bokningen är personlig och får inte överlåtas.</li></ul>
            <h3 class="text-xl mb-2">🧹 Städning och ansvar</h3><p>För att hålla gästlägenheten trivsam för alla är det viktigt att du:</p><ul class="list-disc list-inside text-gray-700 m-2 p-0"><li>Städar efter dig enligt städinstruktionerna.</li><li>Lämnar lägenheten i gott skick.</li></ul><p>Om reglerna inte följs kan straffavgift tillkomma för extra städning eller skador.</p>
        `)
    }, []);

    useEffect(() => {
        (async () => {
            await refreshBookings();
        })();
    }, [refreshBookings]);

    return (
        <>
            <div class="h-screen">
                <h1 class="text-5xl mb-6">Bokning av gästlägenheten</h1>
                <div class="mb-6">Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. <a href="" onClick={(e) => { e.preventDefault(); setOpenAlertDialog(true) }}>Här</a> hittar du all viktig information inför din bokning.</div>
                <GuestSuiteCalendar
                    bookings={bookings}
                    refreshBookings={refreshBookings}
                />
            </div>

            <AlertDialog
                open={openAlertDialog}
                title="🏡 Gästlägenhet - Bokningsinformation"
                message={alertDialogMessage}
                onConfirm={() => { setOpenAlertDialog(false); }}
                confirmColor="green"
            />
        </>
    );
}