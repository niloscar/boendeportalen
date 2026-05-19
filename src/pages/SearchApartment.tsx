import { useState, useEffect, useMemo } from 'react';
import ApartmentList from '../components/SearchApartmentPage/ApartmentList.tsx';
import ApartmentFilter from '../components/SearchApartmentPage/ApartmentFilter.tsx';
import type { Apartment, Rent, Available, ApartmentData } from "../types/Apartment.ts";

const SearchApartment = () => {
    const [apartments, setApartments] = useState<Apartment[]>([
    ]);
    const [rent, setRent] = useState<Rent[]>([
    ]);
    const [availableFrom, setAvailableFrom] = useState<Available[]>([
    ]);

    useEffect(() => {
        setApartments([
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
            },
            {
                id: 3,
                street: "Storgatan 12",
                postcode: 11122,
                city: "Stockholm",
                area: 35,
                rooms: "Ett rum och kök",
                district: "Östermalm",
                description: "En trevlig enrummare mitt i stan!"
            }
        ]);
        setRent([
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
            {
                id: 3,
                apartment_id: 3,
                rent: 13000,
                start_date: "2026-01-01",
                end_date: null
            },
        ]);
        setAvailableFrom([{
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
        {
            id: 3,
            apartment_id: 3,
            renter_id: 14,
            start_date: "2026-02-02",
            end_date: "2026-01-01"
        },
        ]);
    }, []);

   const apartmentCombined: ApartmentData[] = useMemo(() => {
        return apartments.flatMap((apartment) => {
            const thisAvailability = availableFrom.find(
                a => a.apartment_id === apartment.id
            );

            const thisRent = rent.find(
                r => r.apartment_id === apartment.id
            );

            if (!thisAvailability || !thisRent) {
                return [];
            }

            return [{
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
            }];
        });
    }, [apartments, rent, availableFrom]);
    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <h1 className="text-5xl">Lediga lägenheter</h1>
            <ApartmentFilter />
            <ApartmentList apartments={apartmentCombined} />
        </div>
    )
}

export default SearchApartment
