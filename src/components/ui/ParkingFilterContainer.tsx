import type { ParkingSortOption, FilterProps } from '../../types/parking'

export default function FilterBar({
    searchQuery,
    selectedCities,
    selectedTypes,
    sortBy,
    cityOptions,
    typeOptions,
    onSearchChange,
    onCityChange,
    onTypeChange,
    onSortChange,
    onClear,
}: FilterProps) {
    const citySummary = selectedCities.length === 0 ? 'Alla städer' : `${selectedCities.length} valda`
    const typeSummary = selectedTypes.length === 0 ? 'Alla typer' : `${selectedTypes.length} valda`

    return (
        <section className="w-full bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <label className="flex flex-col gap-1 lg:col-span-2">
                    <span className="text-sm text-neutral-600">Sök</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Adress, stad, postnummer eller typ"
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label="Sök parkeringsplatser"
                    />
                </label>

                <div className="flex flex-col gap-1 relative">
                    <span className="text-sm text-neutral-600">Stad (flera val)</span>
                    <details className="group">
                        <summary className="list-none w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between">
                            <span className="text-neutral-800">{citySummary}</span>
                            <span className="text-neutral-500 text-xs">▼</span>
                        </summary>
                        <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-lg border border-neutral-300 bg-white shadow-md p-2">
                            <div className="mb-2 flex justify-end">
                                <button type="button" onClick={() => onCityChange([])} className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer">
                                    Rensa
                                </button>
                            </div>
                            {cityOptions.map((city) => {
                                const checked = selectedCities.includes(city)

                                return (
                                    <label key={city} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                const next = checked ? selectedCities.filter((value) => value !== city) : [...selectedCities, city]
                                                onCityChange(next)
                                            }}
                                        />
                                        <span className="text-sm text-neutral-800">{city}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </details>
                </div>

                <div className="flex flex-col gap-1 relative">
                    <span className="text-sm text-neutral-600">Typ (flera val)</span>
                    <details className="group">
                        <summary className="list-none w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between">
                            <span className="text-neutral-800">{typeSummary}</span>
                            <span className="text-neutral-500 text-xs">▼</span>
                        </summary>
                        <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-lg border border-neutral-300 bg-white shadow-md p-2">
                            <div className="mb-2 flex justify-end">
                                <button type="button" onClick={() => onTypeChange([])} className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer">
                                    Rensa
                                </button>
                            </div>
                            {typeOptions.map((type) => {
                                const checked = selectedTypes.includes(type)

                                return (
                                    <label key={type} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                const next = checked ? selectedTypes.filter((value) => value !== type) : [...selectedTypes, type]
                                                onTypeChange(next)
                                            }}
                                        />
                                        <span className="text-sm text-neutral-800">{type}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </details>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-600">Sortera</span>
                    <select
                        value={sortBy}
                        onChange={(event) => onSortChange(event.target.value as ParkingSortOption)}
                        className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                        aria-label="Sortera parkeringsplatser"
                    >
                        <option value="price-asc">Pris: lägst först</option>
                        <option value="price-desc">Pris: högst först</option>
                        <option value="date-asc">Tillgänglig: tidigast först</option>
                        <option value="date-desc">Tillgänglig: senast först</option>
                        <option value="address-asc">Adress: A-Ö</option>
                    </select>
                </label>
            </div>

            <div className="mt-3 flex justify-end">
                <button type="button" onClick={onClear} className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500">
                    Rensa filter
                </button>
            </div>
        </section>
    )
}
