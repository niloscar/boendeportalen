import apiConfig from "./axiosConfig";
import type { Booking, Timeslot } from "../components/LaundryPage/Calendar";

// Types -----------------------------

type TimeslotRow = {
    id: number;
    slot_start: string;
    slot_end: string;
};

type BookingRow = {
    id: number;
    date: string;
    slot: number;
    user: number;
};

//Fetch timeslots from Supabase
export async function fetchLaundrySlots() {
    try {
        const { data } = await apiConfig.get<TimeslotRow[]>(
            "laundry_time_slots?select=*"
        );

        return data.map((row): Timeslot => ({
            id: row.id,
            start: row.slot_start,
            end: row.slot_end
        }));

    } catch (err) {
        console.error("Fel vid slots-hämtning:", err);
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

        return data.map((row): Booking => ({
            id: row.id,
            date: row.date,
            slot: row.slot,
            user: row.user
        }));

    } catch (err) {
        console.error("Fel vid bookings-hämtning:", err);
        throw err;
    }
}

//Delete booking from Supabase based on id
export async function deleteBooking(id: number) {
    try {
        const response = await apiConfig.delete("laundry_bookings", {
            params: { id: `eq.${id}` }
        });

        return { success: true, data: response.data };

    } catch (error: unknown) {
        return {
            success: false,
            error: error.response?.data ?? error.message
        };
    }
}

//Create a new booking
export async function createBooking(user: number, slot: number, date: string) {
    try {
        const response = await apiConfig.post<BookingRow[]>("laundry_bookings", {
            user,
            slot,
            date
        });

        return response.data;

    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}
