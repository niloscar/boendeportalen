import axios from "axios";
import apiConfig from "./axiosConfig";
import type { TimeslotRow, Timeslot, BookingRow, Booking } from "../types/booking";

//Fetch timeslots from Supabase
export async function fetchLaundrySlots() {
    try {
        const { data } = await apiConfig.get<TimeslotRow[]>(
            "laundry_time_slots?select=*"
        );

        return data.map((row:TimeslotRow): Timeslot => ({
            id: row.id,
            start: row.slot_start,
            end: row.slot_end
        }));

    } catch (err) {
        console.error("Fel vid slots-hämtning: ", err);
        throw err;
    }
}

//Fetch today's and future bookings from Supabase
export async function fetchBookedSlots() {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data } = await apiConfig.get<BookingRow[]>(
            `laundry_bookings?select=*&date=gte.${today}`
        );

        return data.map((row: BookingRow): Booking => ({
            id: row.id,
            date: row.date,
            slot: row.slot,
            user: row.user
        }));

    } catch (err) {
        console.error("Fel vid bookings-hämtning: ", err);
        throw err;
    }
}

//Delete booking from Supabase based on id
export async function deleteLaundryRoomBooking(id: number) {
    try {
        const response = await apiConfig.delete("laundry_bookings", {
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
export async function createLaundryRoomBooking(user: string, slot: number, date: string) {
    try {
        const response = await apiConfig.post<BookingRow[]>("laundry_bookings", {
            user,
            slot,
            date
        });

        return response.data;

    } catch (error) {
        console.error("Fel vid skapande av ny bokning: ", error);
        throw error;
    }
}
