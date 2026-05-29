import axios from "axios";
import apiConfig from "./axiosConfig";
import type { BookingRow, Booking } from "../types/booking";
import type { ApiResult } from "../types/booking";

// Fetch today's and future bookings
export async function fetchBookedSlots(): Promise<ApiResult<Booking[]>> {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data } = await apiConfig.get<BookingRow[]>(
            `guest_suite_bookings?select=*&date=gte.${today}`
        );

        const mapped = data.map((row): Booking => ({
            id: row.id,
            date: row.date,
            slot: null,
            user_id: row.user_id
        }));

        return { success: true, data: mapped };

    } catch (error: unknown) {
        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte hämta bokningar"
        };
    }
}

// Delete booking
export async function deleteGuestSuiteBooking(id: number): Promise<ApiResult<void>> {
    try {
        const response = await apiConfig.delete("guest_suite_bookings", {
            params: { id: `eq.${id}` }
        });

        return { success: true, data: response.data };

    } catch (error: unknown) {
        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte ta bort bokningen"
        };
    }
}

// Create booking
export async function createGuestSuiteBooking(
    user_id: string,
    date: string
): Promise<ApiResult<BookingRow[]>> {
    try {
        const response = await apiConfig.post<BookingRow[]>("guest_suite_bookings", {
            user_id,
            date
        });

        return { success: true, data: response.data };

    } catch (error: unknown) {
        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte skapa bokningen"
        };
    }
}
