import { useState, useEffect } from 'react'
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
            area: 34,
            rooms: "Ett rum och kök",
            district: "Östermalm",
            description: "En trevlig enrummare mitt i stan!"
        },
        {
            id: 4,
            street: "Storgatan 12",
            postcode: 11122,
            city: "Stockholm",
            area: 35,
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
            apartment_id: 4,
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
        apartment_id: 4,
        renter_id: 14,
        start_date: "2026-02-02",
        end_date: "2026-01-01"
    },
    ]);
    useEffect(() => {
        const newData: FullData[] = [];
        apartments.forEach(apartment => {
            const thisAvailability: Available | undefined = availableFrom.find(a => a.apartment_id === apartment.id);
            const thisRent: Rent | undefined = rent.find(a => a.apartment_id === apartment.id);
            if (thisRent != undefined && thisAvailability != undefined) {
                newData.push({
                    id: apartment.id,
                    street: apartment.street,
                    postcode: apartment.postcode,
                    city: apartment.city,
                    area: apartment.area,
                    rooms: apartment.rooms,
                    district: apartment.district,
                    description: apartment.description,
                    rent: thisRent.rent,
                    available: thisAvailability.end_date
                })
            }
        })
        setFullData(newData);
    }, [])

    return (
        <div>
            <h1>Lediga lägenheter</h1>
            <div>
                <ApartmentFilter />
                <ApartmentList apartments={fullData} />
            </div>
        </div>
    )
}

export default SearchApartment
