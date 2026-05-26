import { useState } from "react";
import { createLaundryRoomBooking, deleteLaundryRoomBooking } from "../api/laundryRoom";
import { createGuestSuiteBooking, deleteGuestSuiteBooking } from "../api/guestSuite";
import type { UseBookingActionsProps, Booking, NewBooking } from "../types/booking";

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
        const userBookings = bookings.filter(b => b.user_id === user.id);
        
        //Create booking
        switch (bookingType) {
            case "LaundryRoom":

                try {
                    if (newBooking.slot !== null) {
                        await createLaundryRoomBooking(
                            newBooking.user_id,
                            newBooking.slot,
                            newBooking.date
                        );
                    }
                } catch (error) {
                    console.error("Fel vid skapande av bokning:", error);
                }

                //Delete old bookings
                for (const b of userBookings) {
                    if (b.id) {
                        await deleteLaundryRoomBooking(b.id);
                    }
                }
                break;

            case "GuestSuite":
                await createGuestSuiteBooking(newBooking.user_id, newBooking.date);
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