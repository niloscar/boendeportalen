import { useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { useBookingIndicatorProps } from "../types/booking";
import BookingIndicator from "../components/bookings/BookingIndicator";

export function useBookingIndicator({ myEvents, currentIndex, goToBooking }: useBookingIndicatorProps) {

    const renderIndicatorInHeader = useCallback(() => {
        const parent = document.getElementById("parent") as HTMLDivElement | null;
        if (!parent) return;

        // Remove old indicator
        const oldContainer = parent.querySelector(".booking-indicator-container");
        if (oldContainer) oldContainer.remove();

        // Create new container
        const container = document.createElement("span");
        container.className = "booking-indicator-container";
        parent.appendChild(container);

        // Render React component
        const root = createRoot(container);
        root.render(
            <BookingIndicator total={ myEvents.length } currentIndex = { currentIndex } onSelect = { goToBooking } />
    );
    }, [myEvents.length, currentIndex, goToBooking]);

    // Re-render when dependencies change
    useEffect(() => {
        renderIndicatorInHeader();
    }, [renderIndicatorInHeader]);

    // Run once when FullCalendar view mounts
    const handleViewDidMount = () => {
        setTimeout(renderIndicatorInHeader, 0);
    };

    return { handleViewDidMount };
}