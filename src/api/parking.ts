import { supabase } from '../lib/supabase'
import type { ParkingSortOption, ParkingSpot } from '../types/parking'

type ParkingSpotRow = {
    id: number
    address: string
    city: string
    postal_code: string
    spot_type: string
    price: number
    available_from: string
    renter: string | null
    application: 'Open' | 'Closed'
    created_at: string
    updated_at: string
}

type ParkingSpotInsert = {
    address: string
    city: string
    postal_code: string
    spot_type: string
    price: number
    available_from: string
    renter?: string | null
    application?: 'Open' | 'Closed'
}

type ParkingSpotUpdate = Partial<ParkingSpotInsert>

export type ParkingSpotFilters = {
    searchQuery?: string
    cities?: string[]
    types?: string[]
    application?: ParkingSpot['application'] | 'all'
    sortBy?: ParkingSortOption
    limit?: number
    offset?: number
}

export type ParkingSpotInput = {
    address: string
    city: string
    postalCode: string
    type: string
    price: number
    availableFrom: string
    renter?: string | null
    application?: ParkingSpot['application']
}

const mapRowToParkingSpot = (row: ParkingSpotRow): ParkingSpot => ({
    id: row.id,
    address: row.address,
    city: row.city,
    postalCode: row.postal_code,
    type: row.spot_type,
    price: row.price,
    availableFrom: row.available_from,
    renter: row.renter,
    application: row.application,
})

export async function fetchParkingSpots(filters: ParkingSpotFilters = {}) {
    const {
        searchQuery,
        cities = [],
        types = [],
        application = 'Open',
        sortBy = 'price-asc',
        limit,
        offset,
    } = filters

    let query = supabase
        .from('parking_spots')
        .select('id, address, city, postal_code, spot_type, price, available_from, renter, application, created_at, updated_at', { count: 'exact' })

    if (application !== 'all') {
        query = query.eq('application', application)
    }

    if (searchQuery?.trim()) {
        const term = searchQuery.trim()
        query = query.or([
            `address.ilike.%${term}%`,
            `city.ilike.%${term}%`,
            `postal_code.ilike.%${term}%`,
            `spot_type.ilike.%${term}%`,
        ].join(','))
    }

    if (cities.length > 0) {
        query = query.in('city', cities)
    }

    if (types.length > 0) {
        query = query.in('spot_type', types)
    }

    if (sortBy === 'price-asc') query = query.order('price', { ascending: true })
    else if (sortBy === 'price-desc') query = query.order('price', { ascending: false })
    else if (sortBy === 'date-asc') query = query.order('available_from', { ascending: true })
    else if (sortBy === 'date-desc') query = query.order('available_from', { ascending: false })
    else query = query.order('address', { ascending: true })

    if (typeof offset === 'number') {
        query = query.range(offset, typeof limit === 'number' ? offset + limit - 1 : offset + 999)
    } else if (typeof limit === 'number') {
        query = query.limit(limit)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
        data: (data ?? []).map(mapRowToParkingSpot),
        count: count ?? 0,
    }
}

export async function fetchParkingSpotById(id: number) {
    const { data, error } = await supabase
        .from('parking_spots')
        .select('id, address, city, postal_code, spot_type, price, available_from, renter, application, created_at, updated_at')
        .eq('id', id)
        .single()

    if (error) throw error

    return mapRowToParkingSpot(data as ParkingSpotRow)
}

export async function createParkingSpot(input: ParkingSpotInput) {
    const payload: ParkingSpotInsert = {
        address: input.address,
        city: input.city,
        postal_code: input.postalCode,
        spot_type: input.type,
        price: input.price,
        available_from: input.availableFrom,
        renter: input.renter ?? null,
        application: input.application ?? 'Open',
    }

    const { data, error } = await supabase
        .from('parking_spots')
        .insert(payload)
        .select('id, address, city, postal_code, spot_type, price, available_from, renter, application, created_at, updated_at')
        .single()

    if (error) throw error

    return mapRowToParkingSpot(data as ParkingSpotRow)
}

export async function updateParkingSpot(id: number, input: Partial<ParkingSpotInput>) {
    const payload: ParkingSpotUpdate = {
        ...(input.address !== undefined ? { address: input.address } : {}),
        ...(input.city !== undefined ? { city: input.city } : {}),
        ...(input.postalCode !== undefined ? { postal_code: input.postalCode } : {}),
        ...(input.type !== undefined ? { spot_type: input.type } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.availableFrom !== undefined ? { available_from: input.availableFrom } : {}),
        ...(input.renter !== undefined ? { renter: input.renter } : {}),
        ...(input.application !== undefined ? { application: input.application } : {}),
    }

    const { data, error } = await supabase
        .from('parking_spots')
        .update(payload)
        .eq('id', id)
        .select('id, address, city, postal_code, spot_type, price, available_from, renter, application, created_at, updated_at')
        .single()

    if (error) throw error

    return mapRowToParkingSpot(data as ParkingSpotRow)
}

export async function deleteParkingSpot(id: number) {
    const { error } = await supabase.from('parking_spots').delete().eq('id', id)

    if (error) throw error

    return { success: true }
}

export async function setParkingSpotRenter(id: number, renterId: string | null) {
    return updateParkingSpot(id, { renter: renterId })
}
