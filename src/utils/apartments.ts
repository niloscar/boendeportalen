import type { ApartmentData } from "../types/apartment.ts";

export const getUniqueOptions = (apartments: ApartmentData[], key: 'district' | 'rooms') => Array.from(new Set(apartments.map((apartment) => apartment[key]))).sort((a, b) => a.localeCompare(b, 'sv-SE'))
