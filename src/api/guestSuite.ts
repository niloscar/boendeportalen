import axios from "axios";
import apiConfig from "./axiosConfig";
import type { BookingRow, Booking } from "../types/booking";

//Fetch today's and future bookings from Supabase
export async function fetchBookedSlots() {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data } = await apiConfig.get<BookingRow[]>(
            `guest_suite_bookings?select=*&date=gte.${today}`
        );

        return data.map((row: BookingRow): Booking => ({
            id: row.id,
            date: row.date,
            slot: null,
            user: row.user
        }));

    } catch (err) {
        console.error("Fel vid bookings-hämtning: ", err);
        throw err;
    }
}

//Delete booking from Supabase based on id
export async function deleteGuestSuiteBooking(id: number) {
    try {
        const response = await apiConfig.delete("guest_suite_bookings", {
            params: { id: `eq.${id}` }
        });

        return { success: true, data: response.data };

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data ?? error.message
            };
        }

        // fallback för andra typer av fel
        return {
            success: false,
            error: "Oväntat fel"
        };
    }
}

//Create a new booking
export async function createGuestSuiteBooking(user: string, date: string) {
    try {
        const response = await apiConfig.post<BookingRow[]>("guest_suite_bookings", {
            user,
            date
        });

        return response.data;

    } catch (error) {
        console.error("Fel vid skapande av ny bokning: ", error);
        throw error;
    }
}
