import FilterBar from '../components/ui/ParkingFilterContainer'
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
        <div className="flex w-full max-w-5xl flex-col items-center gap-6 p-6">
            <h1 className="text-3xl md:text-5xl font-bold">Lediga parkeringsplatser</h1>
            <p className="text-gray-600">Här hittar du lediga parkeringsplatser i din närhet.</p>

            <FilterBar
                searchQuery={searchQuery}
                selectedCities={selectedCities}
                selectedTypes={selectedTypes}
                sortBy={sortBy}
                cityOptions={cityOptions}
                typeOptions={typeOptions}
                onSearchChange={setSearchQuery}
                onCityChange={setSelectedCities}
                onTypeChange={setSelectedTypes}
                onSortChange={setSortBy}
                onClear={resetFilters}
            />

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