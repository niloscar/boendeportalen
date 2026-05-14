import { useEffect, useState } from 'react'
import SortButton from './SortButton'

const MOCK_RESIDENTS = [
    { id: 1, fname: 'John', lname: 'Doe', apartment: '101', entrance: 'A', status: 'Aktiv', date: '2023-01-01' },
    { id: 2, fname: 'Jane', lname: 'Smith', apartment: '102', entrance: 'B', status: 'Inaktiv', date: '2023-02-01' },
    { id: 3, fname: 'Alice', lname: 'Johnson', apartment: '103', entrance: 'A', status: 'Aktiv', date: '2023-03-01' },
    { id: 4, fname: 'Bob', lname: 'Brown', apartment: '104', entrance: 'B', status: 'Aktiv', date: '2023-04-01' },
    { id: 5, fname: 'Charlie', lname: 'Davis', apartment: '105', entrance: 'A', status: 'Inaktiv', date: '2023-05-01' },
]

const RESIDENT_KEY_MAP = {
    fname: 'Förnamn',
    lname: 'Efternamn',
    apartment: 'Lägenhetsnummer',
    entrance: 'Uppgång',
    status: 'Status',
    date: 'Tilläggsdatum',
}

const SEARCHABLE_RESIDENT_KEYS = [
    'fname',
    'lname',
    'apartment'
] satisfies readonly (keyof Resident)[]

type Resident = typeof MOCK_RESIDENTS[number]
type SortField = keyof typeof RESIDENT_KEY_MAP
type SortDirection = 'asc' | 'desc'
type SearchResultOrder = {
    field: SortField
    direction: SortDirection
}

export default function AdminPageResidents() {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [searchResultOrder, setSearchResultOrder] = useState<SearchResultOrder>({ field: 'fname', direction: 'asc' })
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<{ message: string, details: unknown } | null>(null)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()

        setSearchTerm(value)
        setSearchError(null)

        // If the search term is empty, reset the search results and state.
        if (!value) {
            setDebouncedSearchTerm('')
            setIsSearching(false)
            return
        }

        setIsSearching(true)
    }

    useEffect(() => {
        if (!searchTerm) return

        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm) // Set the debounced search term after 500ms of inactivity.
            setIsSearching(false)
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const normalizedSearchTerm = debouncedSearchTerm.trim().toLowerCase()

    const searchResults = normalizedSearchTerm
        ? MOCK_RESIDENTS.filter(resident => {
            const haystack = SEARCHABLE_RESIDENT_KEYS // Create a haystack string by concatenating the values of the searchable keys for this resident.
                .map(key => resident[key])
                .join(' ')
                .toLowerCase()

            return haystack.includes(normalizedSearchTerm)
        })
        : MOCK_RESIDENTS

    const handleSortChange = (field: SortField) => {
        setSearchResultOrder((currentOrder) => {
            if (currentOrder.field !== field) return { field, direction: 'asc' }

            return {
                field,
                direction: currentOrder.direction === 'asc' ? 'desc' : 'asc',
            }
        })
    }

    const sortedSearchResults = [...searchResults].sort((a, b) => {
        const { field, direction } = searchResultOrder

        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1 // Eg. if (a['fname'] < b['fname']) return -1 for ascending, 1 for descending.
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1

        return 0
    })

    const hasResults = sortedSearchResults.length > 0
    const showEmptyState = !hasResults && !isSearching && !searchError

    return (
        <>
            <search>
                <label htmlFor="resident-search" className="sr-only">Sök boende</label>
                <input
                    id="resident-search"
                    name="search"
                    className="w-full rounded-2xl bg-neutral-200 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="search"
                    placeholder="Sök boende..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </search>

            {isSearching && <p className="text-sm text-gray-500">Söker...</p>}
            {searchError && <p className="text-sm text-red-500">{searchError.message}</p>}
            {showEmptyState && <p className="text-sm text-gray-500">Inga boende hittades.</p>}
            {hasResults && !isSearching && (
                <>
                    <p className="text-sm text-gray-500">{sortedSearchResults.length} boende visas.</p>

                    <table className="search-results w-full table-auto">
                        <thead>
                            <tr className="search-filters">
                                {Object.entries(RESIDENT_KEY_MAP).map(([key, label]) => {
                                    const sortField = key as SortField
                                    const isActive = searchResultOrder.field === sortField
                                    const direction = isActive
                                        ? searchResultOrder.direction
                                        : 'asc'

                                    return (
                                        <th key={key}>
                                            <SortButton
                                                onClick={() => handleSortChange(sortField)}
                                                value={`${sortField}:${direction}`}
                                                isActive={isActive}
                                            >
                                                {label}
                                            </SortButton>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {sortedSearchResults.map(resident => (
                                <tr key={resident.id}>
                                    <td>{resident.fname}</td>
                                    <td>{resident.lname}</td>
                                    <td>{resident.apartment}</td>
                                    <td>{resident.entrance}</td>
                                    <td>{resident.status}</td>
                                    <td>{resident.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}