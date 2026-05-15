import axios from "axios";

export type LaundrySlot = {
    id: string;
    date: string;
    slot: number;
    user: string;
};

export async function fetchLaundrySlots() {
    console.log("Hämtar från Supabase...");

    try {
        const { data } = await axios.get(
            "https://zavnweqhytaqbpswyhcl.supabase.co/rest/v1/laundry_time_slots?select=*",
            {
                headers: {
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
            }
        );

        console.log("Supabase svar:", data);
        return data.map((row: any) => ({
            slotId: row.id,
            start: row.slot_start,
            end: row.slot_end
        }));

    } catch (err) {
        console.error("Fel vid hämtning:", err);
        throw err;
    }
}

