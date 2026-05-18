import axios from "axios";
import type { Booking, Timeslot } from "../src/components/LaundryPage/Calendar";

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

export async function fetchLaundrySlots() {
    console.log("Hämtar slots från Supabase...");

    try {
        const { data }: { data: TimeslotRow[] } = await axios.get(
            "https://zavnweqhytaqbpswyhcl.supabase.co/rest/v1/laundry_time_slots?select=*",
            {
                headers: {
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
            }
        );

        console.log("Supabase svar:", data);
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

export async function fetchBookedSlots() {
    console.log("Hämtar bookings från Supabase...");

    try {
        const { data }: { data: BookingRow[] } = await axios.get(
            "https://zavnweqhytaqbpswyhcl.supabase.co/rest/v1/laundry_bookings?select=*",
            {
                headers: {
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
            }
        );

        console.log("Supabase svar:", data);
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

