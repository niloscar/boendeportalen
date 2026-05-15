import { useState } from 'react'
import ApartmentList from '../components/ApartmentList.tsx'
import ApartmentFilter from '../components/ApartmentFilter.tsx'
import type { Apartment } from "../types/Apartment.ts";

const SearchApartment = () => {
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
    ])
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
