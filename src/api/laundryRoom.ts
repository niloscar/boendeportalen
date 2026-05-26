import axios from "axios";
import apiConfig from "./axiosConfig";
import type { TimeslotRow, Timeslot, BookingRow, Booking } from "../types/booking";
import type { ApiResult } from "../types/booking";

//Fetch timeslots from Supabase
export async function fetchLaundrySlots(): Promise<ApiResult<Timeslot[]>> {
    try {
        const { data } = await apiConfig.get<TimeslotRow[]>(
            "laundry_time_slots?select=*"
        );

        const mapped = data.map((row: TimeslotRow): Timeslot => ({
            id: row.id,
            start: row.slot_start,
            end: row.slot_end
        }));

        return { success: true, data: mapped };

    } catch (error: unknown) {
        console.error("Fel vid slots-hämtning: ", error);

        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte hämta tvättstugans tidsluckor"
        };
    }
}

//Fetch today's and future bookings from Supabase
export async function fetchBookedSlots(): Promise<ApiResult<Booking[]>> {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data } = await apiConfig.get<BookingRow[]>(
            `laundry_bookings?select=*&date=gte.${today}`
        );

        const mapped = data.map((row: BookingRow): Booking => ({
            id: row.id,
            date: row.date,
            slot: row.slot,
            user_id: row.user_id
        }));

        return { success: true, data: mapped };

    } catch (error: unknown) {
        console.error("Fel vid bookings-hämtning: ", error);

        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte hämta bokningar"
        };
    }
}

//Delete booking from Supabase based on id
export async function deleteLaundryRoomBooking(id: number): Promise<ApiResult<any>> {
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
export async function createLaundryRoomBooking(
    user_id: string,
    slot: number,
    date: string
): Promise<ApiResult<BookingRow[]>> {
    try {
        const response = await apiConfig.post<BookingRow[]>("laundry_bookings", {
            user_id,
            slot,
            date
        });

        return { success: true, data: response.data };

    } catch (error: unknown) {
        console.error("Fel vid skapande av ny bokning: ", error);

        return {
            success: false,
            error: axios.isAxiosError(error)
                ? error.response?.data ?? error.message
                : "Kunde inte skapa bokningen"
        };
    }
}
