import type { ApartmentData } from "../types/apartment.ts";
import { formatNumber } from '../utils/calc.ts';

export const getUniqueOptions = (apartments: ApartmentData[], key: 'district' | 'rooms') => Array.from(new Set(apartments.map((apartment) => apartment[key]))).sort((a, b) => a.localeCompare(b, 'sv-SE'))


export function getDetails(apartment: ApartmentData) {
    const calculateLastDay = apartment && subtractMonths(new Date(apartment.end_date), 1);
    const applyBy = calculateLastDay && calculateLastDay.toISOString().split("T")[0];
    function subtractMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
    const details = [
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
            content: apartment.end_date
        },
        {
            id: crypto.randomUUID(),
            title: "Sista ansökningsdag",
            content: applyBy
        },
    ]
      return details

}


