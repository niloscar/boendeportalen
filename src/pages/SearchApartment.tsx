import { useState, useEffect } from 'react';
import type React from 'react';
import Skeleton from '@mui/material/Skeleton';
import ApartmentList from '../components/SearchApartmentPage/ApartmentList.tsx';
import ApartmentFilter from '../components/SearchApartmentPage/ApartmentFilter.tsx';
import type { ApartmentData } from "../types/apartment.ts";
import { getAvailableApartments } from '../api/apartmentApi.ts';

const SearchApartment = () => {
    const [apartments, setApartments] = useState<ApartmentData[]>([]);
    const [filteredApartments, setFilteredApartments] = useState<ApartmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState<string[]>([]);
    const [maxRent, setMaxRent] = useState(20000);
    const [district, setDistrict] = useState<string[]>([]);
    const [filtersVisibility, setFilterVisibility] = useState<boolean>(false);

    const fetchApartments = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAvailableApartments();
            setApartments(data);
            setFilteredApartments(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        (async () => {
            await fetchApartments();
        })();
    }, []);
    const filterResults: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        const filterRooms = rooms.length > 0 ? apartments.filter((a) => rooms.some((room) => room === a.rooms)) : apartments;
        const filterRent = filterRooms.filter(a => a.rent < maxRent);
        const filterArea = district.length > 0 ? filterRent.filter((a) => district.some((dr) => dr === a.district)) : filterRent;
        setFilteredApartments(filterArea);
        setFilterVisibility(false);
    }
    const setVisibility = (visibility: boolean) => {
        setFilterVisibility(visibility)
    }
    const selectedRooms: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const isRoomChecked = rooms.find(r => r == e.target.name);
        if (!isRoomChecked) {
            setRooms([
                ...rooms,
                e.target.name
            ])
        } else {
            setRooms(
                rooms.filter(r =>
                    r !== e.target.name)
            )
        };
    }
    const changeRent: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setMaxRent(parseInt(e.target.value));
    }
    const selectedDistrict: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const isDistrictChecked = district.find(a => a == e.target.name);
        if (!isDistrictChecked) {
            setDistrict([
                ...district,
                e.target.name
            ])
        } else {
            setDistrict(
                district.filter(a =>
                    a !== e.target.name)
            )
        };
    }

    if (error) {
        return (<div>Problem med att hämta lägenheter. Vänligen ladda om sidan och försök igen. </div>)
    }

    return (
        <div className="flex flex-col items-center gap-6 p-6 max-w-6xl">
            <h1 className="text-3xl md:text-5xl">Lediga lägenheter</h1>
            <ApartmentFilter rooms={rooms} maxRent={maxRent} district={district} filtersVisibility={filtersVisibility} selectedRooms={selectedRooms} changeRent={changeRent} selectedDistrict={selectedDistrict} filterResults={filterResults} setVisibility={setVisibility} />
            {loading ?
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                    <Skeleton variant="rounded" className="w-xs" height="502px" />
                </div>
                :
                apartments.length < 1 ?
                    <div>Kunde inte hitta några lediga lägenheter</div>
                    :
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-cols-max gap-4 items-start">
                        <ApartmentList variant="div" items={filteredApartments} />
                    </div>
            }
        </div>
    )
}

export default SearchApartment
