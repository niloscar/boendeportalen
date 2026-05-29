import type { ApartmentData } from "../types/apartment.ts";
import { formatNumber } from '../utils/calc.ts';
import { getAvailableApartment } from '../api/apartmentApi.ts';

export const getUniqueOptions = (apartments: ApartmentData[], key: 'district' | 'rooms') => Array.from(new Set(apartments.map((apartment) => apartment[key]))).sort((a, b) => a.localeCompare(b, 'sv-SE'))

export function getDetails(apartment: ApartmentData) {
    const calculateLastDay = apartment.end_date ? subtractMonths(new Date(apartment.end_date), 1) : null;
    const applyBy = calculateLastDay ? calculateLastDay.toISOString().split("T")[0] : 'Går ej att ansöka';
    function subtractMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
    const details = apartment && [
        {
            id: crypto.randomUUID(),
            title: "Kvadratmeter",
            content: apartment.area
        },
        {
            id: crypto.randomUUID(),
            title: "Antal rum",
            content: apartment.rooms
        },
        {
            id: crypto.randomUUID(),
            title: "Hyra",
            content: `${formatNumber(apartment.rent)} kr/mån`
        },
        {
            id: crypto.randomUUID(),
            title: "Område",
            content: apartment.district
        },
        {
            id: crypto.randomUUID(),
            title: "Tillgänglig från",
            content: apartment.end_date ? apartment.end_date : 'Inget slutdatum finns'
        },
        {
            id: crypto.randomUUID(),
            title: "Sista ansökningsdag",
            content: apartment.end_date ? applyBy : 'Går ej att ansöka'
        },
    ] 
      return details
}

export const fetchApartments = async (apartmentId : string) => {
     if (!apartmentId) throw new Error('Lägenhets ID saknas');
        try {
            const data = await getAvailableApartment(apartmentId);
            return data
        } catch (error: unknown) {
            if (error instanceof Error) {
               new Error('Kunde inte hämta lägenheten.')
            }
        }
    }