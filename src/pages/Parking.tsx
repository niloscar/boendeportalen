import FilterBox from '../components/ui/FilterBox'
import Button from '../components/ui/Button'
import ParkingList from '../components/parking/ParkingList'
import useParkingPage from '../hooks/useParkingPage'

export default function Parking() {
    const {
        searchQuery,
        setSearchQuery,
        selectedCities,
        setSelectedCities,
        selectedTypes,
        setSelectedTypes,
        sortBy,
        setSortBy,
        isLoading,
        loadError,
        currentPage,
        setCurrentPage,
        cityOptions,
        typeOptions,
        totalPages,
        currentSpots,
        spots,
        resetFilters,
    } = useParkingPage()

    return (
        <div className="flex w-full flex-col items-center gap-6">
            <h1 className="text-3xl md:text-5xl font-bold">Lediga parkeringsplatser</h1>
            <p className="text-gray-600">Här hittar du lediga parkeringsplatser i din närhet.</p>

            {/* Filter box for searching and filtering parking spots. Adding all fields needed for the parking list page. */}
            <FilterBox
                fields={[
                    {
                        kind: 'search',
                        label: 'Sök',
                        value: searchQuery,
                        onChange: setSearchQuery,
                        placeholder: 'Adress, stad, postnummer eller typ',
                        ariaLabel: 'Sök parkeringsplatser',
                        className: 'lg:col-span-2',
                    },
                    {
                        kind: 'dropdown',
                        label: 'Stad / Område',
                        summary: selectedCities.length === 0 ? 'Alla städer' : `${selectedCities.length} ${selectedCities.length === 1 ? 'vald' : 'valda'}`,
                        options: cityOptions.map((city) => ({
                            label: city,
                            value: city,
                            checked: selectedCities.includes(city),
                            onToggle: () => {
                                const next = selectedCities.includes(city) ? selectedCities.filter((value) => value !== city) : [...selectedCities, city]
                                setSelectedCities(next)
                            },
                        })),
                        onClear: () => setSelectedCities([]),
                    },
                    {
                        kind: 'dropdown',
                        label: 'Typ',
                        summary: selectedTypes.length === 0 ? 'Alla typer' : `${selectedTypes.length} ${selectedTypes.length === 1 ? 'vald' : 'valda'}`,
                        options: typeOptions.map((type) => ({
                            label: type,
                            value: type,
                            checked: selectedTypes.includes(type),
                            onToggle: () => {
                                const next = selectedTypes.includes(type) ? selectedTypes.filter((value) => value !== type) : [...selectedTypes, type]
                                setSelectedTypes(next)
                            },
                        })),
                        onClear: () => setSelectedTypes([]),
                    },
                    {
                        kind: 'select',
                        label: 'Sortera',
                        value: sortBy,
                        onChange: (value) => setSortBy(value as typeof sortBy),
                        ariaLabel: 'Sortera parkeringsplatser',
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

            {/* Parking spot list component. */}
            <ParkingList
                currentSpots={currentSpots}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
                isLoading={isLoading}
                loadError={loadError}
                hasSpots={spots.length > 0}
            />
        </div>
    )
}