import { useState } from "react";
import { createLaundryRoomBooking, deleteLaundryRoomBooking } from "../api/laundryRoom";
import { createGuestSuiteBooking, deleteGuestSuiteBooking } from "../api/guestSuite";
import type { Booking, NewBooking } from "../types/booking";
import type { User } from '@supabase/supabase-js'

type UseBookingActionsProps = {
    user: User | null;
    bookings: Booking[];
    refreshBookings: () => Promise<void>;
    setOpenBookDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setNewBooking: (value: NewBooking | null) => void;
    setDelBooking: (value: Booking | null) => void;
    bookingType: "GuestSuite" | "LaundryRoom";
};

export function useBookingActions({
    user,
    bookings,
    refreshBookings,
    setOpenBookDialog,
    setOpenDeleteDialog,
    setNewBooking,
    setDelBooking,
    bookingType
}: UseBookingActionsProps) {
    
    const [isProcessing, setIsProcessing] = useState(false);

    // Create booking and close dialog, re-render calendar.
    async function createNewBooking(newBooking: NewBooking | null) {

        //Make sure all of the info needed is provided
        if (!user || !newBooking?.date) return;

        //Prevents multiple clicks
        if (isProcessing) return;
        setIsProcessing(true);

        //Find current booking/-s
        const userBookings = bookings.filter(b => b.user === user.id);
        
        //Create booking
        switch (bookingType) {
            case "LaundryRoom":

                //Book new slot
                if (newBooking.slot !== null) {
                    await createLaundryRoomBooking(newBooking.user, newBooking.slot, newBooking.date);
                }

                //Delete old bookings
                for (const b of userBookings) {
                    if (b.id) {
                        await deleteLaundryRoomBooking(b.id);
                    }
                }
                break;

            case "GuestSuite":
                await createGuestSuiteBooking(newBooking.user, newBooking.date);
                break;

            default:
                console.warn("Unknown booking type:", bookingType);
        }
        

        // Cleanup
        setOpenBookDialog(false);
        setNewBooking(null);
        await refreshBookings();

        setIsProcessing(false);
    }


    // Delete booking and close dialog, re-render calendar.

    async function deleteExistingBooking(delBooking: Booking | null) {

        //Make sure all of the info needed is provided
        if (!user || !delBooking?.id) return;

        //Prevents multiple clicks
        if (isProcessing) return;
        setIsProcessing(true);

        //Delete booking
        switch (bookingType) {
            case "LaundryRoom":
                await deleteLaundryRoomBooking(delBooking.id);
                break;

            case "GuestSuite":
                await deleteGuestSuiteBooking(delBooking.id);
                break;

            default:
                console.warn("Unknown booking type:", bookingType);
        }


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