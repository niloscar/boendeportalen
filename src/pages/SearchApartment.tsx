import { useState } from 'react'
import ApartmentList from '../components/ApartmentList.tsx'
import ApartmentFilter from '../components/ApartmentFilter.tsx'
import type { Apartment, Rent, Available, FullData } from "../types/Apartment.ts";

const SearchApartment = () => {
    const [fullData, setFullData] = useState<FullData[]>([]);

    const [apartments, setApartments] = useState<Apartment[]>([
        {
            id: 1,
            street: "Storgatan 12",
            postcode: 11122,
            city: "Stockholm",
            area: "34",
            rooms: "Ett rum och kök",
            district: "Östermalm",
            description: "En trevlig enrummare mitt i stan!"
        },
        {
            id: 4,
            street: "Storgatan 12",
            postcode: 11122,
            city: "Stockholm",
            area: "35",
            rooms: "Ett rum och kök",
            district: "Östermalm",
            description: "En trevlig enrummare mitt i stan!"
        }
    ]);
    const [rent, setRent] = useState<Rent[]>([
        {
            id: 1,
            apartment_id: 1,
            rent: 8000,
            start_date: "2026-01-01",
            end_date: null
        },
        {
            id: 2,
            apartment_id: 2,
            rent: 13000,
            start_date: "2026-01-01",
            end_date: null
        },
    ]);
    const [availableFrom, setAvailableFrom] = useState<Available[]>([{
        id: 1,
        apartment_id: 1,
        renter_id: 1,
        start_date: "2025-01-01",
        end_date: "2026-01-01"
    },
    {
        id: 2,
        apartment_id: 1,
        renter_id: 14,
        start_date: "2026-02-02",
        end_date: null
    },
    {
        id: 3,
        apartment_id: 2,
        renter_id: 2,
        start_date: "2025-01-01",
        end_date: null
    }
    ]);


    return (
        <div>
            <h1>Lediga lägenheter</h1>
            <div>
                <ApartmentFilter />
                <ApartmentList apartments={apartments} />
            </div>
        </div>
    )
}

export default SearchApartment
