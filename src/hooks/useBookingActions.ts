import { useState } from "react";
import { createBooking, deleteBooking } from "../api/laundry";
import type { Booking, NewBooking, BookingRow } from "../types/laundry";

type UseBookingActionsProps = {
    user: string | null;
    bookings: BookingRow[];
    refreshBookings: () => Promise<void>;
    setOpenBookDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setNewBooking: (NewBooking | null);
    setDelBooking: (Booking | null);
};

export function useBookingActions({
    user,
    bookings,
    refreshBookings,
    setOpenBookDialog,
    setOpenDeleteDialog,
    setNewBooking,
    setDelBooking
}: UseBookingActionsProps) {
    
    const [isProcessing, setIsProcessing] = useState(false);

    // Create booking and close dialog, re-render calendar.
    async function createNewBooking(newBooking:NewBooking) {

        //Make sure all of the info needed is provided
        if (!user || !newBooking?.slot || !newBooking?.date) return;

        //Prevents multiple clicks
        if (isProcessing) return;
        setIsProcessing(true);

        //Find current booking/-s
        const userBookings = bookings.filter(b => b.user === user.id);

        //Book new slot
        await createBooking(newBooking.user, newBooking.slot, newBooking.date);

        //Delete old bookings
        for (const b of userBookings) {
            if (b.id) {
                await deleteBooking(b.id);
            }
        }

        // Cleanup
        setOpenBookDialog(false);
        setNewBooking(null);
        await refreshBookings();

        setIsProcessing(false);
    }


    // Delete booking and close dialog, re-render calendar.

    async function deleteExistingBooking(delBooking:Booking) {

        //Make sure all of the info needed is provided
        if (!user || !delBooking?.id) return;

        //Prevents multiple clicks
        if (isProcessing) return;
        setIsProcessing(true);

        //Delete booking
        await deleteBooking(delBooking.id);

        // Cleanup
        setOpenDeleteDialog(false);
        setDelBooking(null);
        await refreshBookings();
        setIsProcessing(false);
    }

    return {
        createNewBooking,
        deleteExistingBooking,
        isProcessing
    };
}