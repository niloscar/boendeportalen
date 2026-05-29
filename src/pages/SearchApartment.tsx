import Skeleton from '@mui/material/Skeleton';
import FilterBox from '../components/ui/FilterBox'
import Button from '../components/ui/Button'
import useApartmentFilter from '../hooks/useApartmentFilter'
import ApartmentList from '../components/searchapartment/ApartmentList.tsx';

const SearchApartment = () => {
    const {
        filteredApartments,
        loading,
        error,
        rooms,
        maxRent,
        district,
        districtOptions,
        roomOptions,
        sortBy,
        resetFilters,
        setDistrict,
        setRooms,
        setMaxRent,
        setSortBy,
    } = useApartmentFilter();

    if (error) {
        return (<div className="w-full flex flex-col items-center gap-6">
            <p>Problem med att hämta lägenheter. Vänligen ladda om sidan och försök igen. </p>
        </div>)
    }

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <h1 className="text-3xl md:text-5xl font-bold">Lediga lägenheter</h1>
            <FilterBox
                fields={[
                    {
                        kind: 'dropdown',
                        label: 'Stad / Område',
                        summary: district.length === 0 ? 'Alla städer' : `${district.length} ${district.length === 1 ? 'vald' : 'valda'}`,
                        options: districtOptions.map((city) => ({
                            label: city,
                            value: city,
                            checked: district.includes(city),
                            onToggle: () => {
                                const next = district.includes(city) ? district.filter((value) => value !== city) : [...district, city]
                                setDistrict(next)
                            },
                        })),
                        onClear: () => setDistrict([]),
                    },
                    {
                        kind: 'dropdown',
                        label: 'Antal rum',
                        summary: rooms.length === 0 ? 'Alla antal rum' : `${rooms.length} ${rooms.length === 1 ? 'vald' : 'valda'}`,
                        options: roomOptions.map((type) => ({
                            label: type,
                            value: type,
                            checked: rooms.includes(type),
                            onToggle: () => {
                                const next = rooms.includes(type) ? rooms.filter((value) => value !== type) : [...rooms, type]
                                setRooms(next)
                            },
                        })),
                        onClear: () => setRooms([]),
                    },
                    {
                        kind: 'range',
                        label: 'Max hyra',
                        min: 5000,
                        max: 20000,
                        value: maxRent,
                        onChange: (value) => setMaxRent(value),
                    },
                    {
                        kind: 'select',
                        label: 'Sortera',
                        value: sortBy,
                        onChange: (value) => setSortBy(value as typeof sortBy),
                        ariaLabel: 'Sortera bostäder',
                        options: [
                            { value: 'price-asc', label: 'Pris: lägst först' },
                            { value: 'price-desc', label: 'Pris: högst först' },
                            { value: 'date-asc', label: 'Tillgänglig: tidigast först' },
                            { value: 'date-desc', label: 'Tillgänglig: senast först' },
                            { value: 'address-asc', label: 'Adress: A-Ö' },
                        ],
                    },
                ]}
                footer={<Button type="button" variant="secondary" size="md" onClick={resetFilters}>Rensa filter</Button>}
            />
            {loading ?
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 items-start w-full">
                    <Skeleton variant="rounded" className="w-full" height="502px" />
                    <Skeleton variant="rounded" className="w-full" height="502px" />
                    <Skeleton variant="rounded" className="w-full" height="502px" />
                </div>
                :
                filteredApartments.length < 1 ?
                    <div>Kunde inte hitta några lediga lägenheter</div>
                    :
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 items-start w-full">
                        <ApartmentList variant="div" items={filteredApartments} />
                    </div>
            }
        </div>
    )
}

export default SearchApartment
