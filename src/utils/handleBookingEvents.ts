import type { LaundryRoomEventParams, GuestSuiteEventParams } from "../types/booking";

export function handleGuestSuiteEventClick({
    e,
    user,
    loading,
    bookings,
    setAlertDialogMessage,
    setOpenAlertDialog,
    setBookDialogMessage,
    setOpenBookDialog,
    setNewBooking,
    setDeleteDialogMessage,
    setOpenDeleteDialog,
    setDelBooking
}: GuestSuiteEventParams) {

    const props = e.event.extendedProps;
    const isOwner = props.isOwner;

    if (loading || !user) return;

    // Available slot
    if (props.isAvailable) {
        const userBookings = bookings.filter(b => b.user === user.id);

        if (userBookings.length >= 5) {
            setAlertDialogMessage("Du har redan fem aktiva bokningar. Avboka ett datum för att kunna boka ett nytt.");
            setOpenAlertDialog(true);
            return;
        }

        setBookDialogMessage(`Vill du boka ${props.date}?\n\nTänk på att du endast kan ha 5 aktiva bokningar åt gången.`);
        setOpenBookDialog(true);
        setNewBooking({ date: props.date, slot: null, user: user.id });
        return;
    }

    // Booked by someone else
    if (!isOwner) {
        e.jsEvent.preventDefault();
        return;
    }

    // Booked by logged‑in user
    setDeleteDialogMessage(`Vill du ta bort bokningen för\n${props.date}?\n\nDen här åtgärden går inte att ångra.`);
    setOpenDeleteDialog(true);
    setDelBooking({ id: Number(e.event.id), date: props.date, slot: null, user: user.id });
}

export function handleLaundryRoomEventClicks({
    e,
    user,
    loading,
    timeslots,
    setBookDialogMessage,
    setOpenBookDialog,
    setNewBooking,
    setDeleteDialogMessage,
    setOpenDeleteDialog,
    setDelBooking
}: LaundryRoomEventParams) {

    const props = e.event.extendedProps;
    const isOwner = props.isOwner;
    const slot = timeslots?.find(s => s.id === props.slot);

    //Wait for user info
    if (loading || !user) {
        return null; // eller en spinner
    }

    // If slot is available
    if (props.isAvailable) {

        //Set message and show pop-up dialog
        setBookDialogMessage(`Vill du boka ${props.date} ${slot?.start}-${slot?.end}?\n\nTänk på att du endast kan ha EN aktiv bokning åt gången och att tidigare bokningar kommer att ersättas.`);
        setOpenBookDialog(true);

        //Prepare data for new booking
        setNewBooking({ date: props.date, slot: props.slot, user: user.id });
        return;
    }

    // If slot is booked by someone else
    if (!isOwner) {
        e.jsEvent.preventDefault();
        return;
    }

    //If slot is booked by the logged in user 
    if (isOwner) {

        //Set message and show pop-up dialog
        setDeleteDialogMessage(`Vill du ta bort bokningen för\n${props.date} ${slot?.start}-${slot?.end}?\n\nDen här åtgärden går inte att ångra.`);
        setOpenDeleteDialog(true);

        //Prepare data for deletion
        setDelBooking({ id: Number(e.event.id), slot: props.slot, date: props.date, user: user.id });
    }
};