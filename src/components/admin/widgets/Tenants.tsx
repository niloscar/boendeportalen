import { useEffect, useState } from 'react'
import { GearSixIcon } from '@phosphor-icons/react'
import SortButton from '../../ui/SortButton'
import type { ChangeEvent } from 'react'

const MOCK_TENANTS = [
    { id: 1, fname: 'John', lname: 'Doe', house: '1', entrance: 'A', apartment: '1001',  status: 'Aktiv', date: '2023-01-01' },
    { id: 2, fname: 'Jane', lname: 'Smith', house: '1', entrance: 'B', apartment: '1001',  status: 'Inaktiv', date: '2023-02-01' },
    { id: 3, fname: 'Alice', lname: 'Johnson', house: '1', entrance: 'A', apartment: '1002', status: 'Aktiv', date: '2023-03-01' },
    { id: 4, fname: 'Bob', lname: 'Brown', house: '1', entrance: 'B', apartment: '1002', status: 'Aktiv', date: '2023-04-01' },
    { id: 5, fname: 'Charlie', lname: 'Davis', house: '1', entrance: 'A', apartment: '1003', status: 'Inaktiv', date: '2023-05-01' },
    { id: 6, fname: 'Eve', lname: 'Miller', house: '1', entrance: 'B', apartment: '1003', status: 'Aktiv', date: '2023-06-01' },
    { id: 7, fname: 'Frank', lname: 'Wilson', house: '1', entrance: 'A', apartment: '1004', status: 'Aktiv', date: '2023-07-01' },
    { id: 8, fname: 'Grace', lname: 'Moore', house: '1', entrance: 'B', apartment: '1004', status: 'Inaktiv', date: '2023-08-01' },
    { id: 9, fname: 'Hank', lname: 'Taylor', house: '1', entrance: 'A', apartment: '1101', status: 'Aktiv', date: '2023-09-01' },
    { id: 10, fname: 'Ivy', lname: 'Anderson', house: '1', entrance: 'B', apartment: '1101', status: 'Aktiv', date: '2023-10-01' },
    { id: 11, fname: 'Jack', lname: 'Thomas', house: '2', entrance: 'A', apartment: '1001', status: 'Inaktiv', date: '2023-11-01' },
    { id: 12, fname: 'Karen', lname: 'Jackson', house: '2', entrance: 'B', apartment: '1001', status: 'Aktiv', date: '2023-12-01' },
    { id: 13, fname: 'Leo', lname: 'White', house: '2', entrance: 'A', apartment: '1002', status: 'Aktiv', date: '2024-01-01' },
    { id: 14, fname: 'Mia', lname: 'Harris', house: '2', entrance: 'B', apartment: '1002', status: 'Inaktiv', date: '2024-02-01' },
    { id: 15, fname: 'Nina', lname: 'Martin', house: '2', entrance: 'A', apartment: '1003', status: 'Aktiv', date: '2024-03-01' },
    { id: 16, fname: 'Oscar', lname: 'Garcia', house: '2', entrance: 'B', apartment: '1003', status: 'Aktiv', date: '2024-04-01' },
    { id: 17, fname: 'Paul', lname: 'Clark', house: '2', entrance: 'A', apartment: '1004', status: 'Inaktiv', date: '2024-05-01' },
    { id: 18, fname: 'Quinn', lname: 'Rodriguez', house: '2', entrance: 'B', apartment: '1004', status: 'Aktiv', date: '2024-06-01' },
    { id: 19, fname: 'Rachel', lname: 'Lewis', house: '2', entrance: 'A', apartment: '1105', status: 'Aktiv', date: '2024-07-01' },
    { id: 20, fname: 'Steve', lname: 'Lee', house: '2', entrance: 'B', apartment: '1105', status: 'Inaktiv', date: '2024-08-01' },
]

const TENANT_KEY_MAP = {
    fname: 'Förnamn',
    lname: 'Efternamn',
    house: 'Hus',
    apartment: 'Lgh.nr',
    entrance: 'Uppgång',
    status: 'Status',
    date: 'Tilläggsdatum',
}

const SEARCHABLE_TENANT_KEYS = [
    'fname',
    'lname',
    'apartment'
] satisfies readonly (keyof Tenant)[]

type Tenant = typeof MOCK_TENANTS[number]
type SortField = keyof typeof TENANT_KEY_MAP
type SortDirection = 'asc' | 'desc'
type SearchResultOrder = {
    field: SortField
    direction: SortDirection
}

export default function AdminTenants() {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [searchResultOrder, setSearchResultOrder] = useState<SearchResultOrder>({ field: 'fname', direction: 'asc' })
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<{ message: string, details: unknown } | null>(null)

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

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

    const normalizedSearchTerms = debouncedSearchTerm
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)

    const searchResults = normalizedSearchTerms.length > 0
        ? MOCK_TENANTS.filter(tenant => {
            const haystack = SEARCHABLE_TENANT_KEYS // Create a haystack string by concatenating the values of the searchable keys for this tenant.
                .map(key => tenant[key])
                .join(' ')
                .toLowerCase()

            return normalizedSearchTerms.every(term => haystack.includes(term))
        })
        : MOCK_TENANTS

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
                    className="w-full rounded-2xl bg-white border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <div className="overflow-auto">
                        <table className="search-results w-full table-auto">
                            <thead>
                                <tr className="search-filters">
                                    {Object.entries(TENANT_KEY_MAP).map(([key, label]) => {
                                        const sortField = key as SortField
                                        const isActive = searchResultOrder.field === sortField
                                        const direction = isActive
                                            ? searchResultOrder.direction
                                            : 'asc'

                                        return (
                                            <th 
                                                key={key}
                                                className="text-left pb-3 not-last:pr-1"
                                            >
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
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedSearchResults.map(tenant => (
                                    <tr 
                                        key={tenant.id}
                                        className="not-last:border-b border-gray-200 hover:bg-gray-100"
                                    >
                                        {Object.keys(TENANT_KEY_MAP).map((key) => (
                                            <td key={key} className="py-1.5">
                                                {tenant[key as keyof Tenant]}
                                            </td>
                                        ))}
                                        <td className="py-1.5">
                                            <GearSixIcon aria-hidden="true" focusable="false" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    )
}
