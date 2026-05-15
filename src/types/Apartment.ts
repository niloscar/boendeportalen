export interface Apartment {
    id: number, street: string, postcode: number, city: string, area: string, rooms: string, district: string, description: string
}

export interface Rent {
    id: number,
    apartment_id: number,
    rent: number,
    start_date: string,
    end_date: string | null
}

export interface Available {
    id: number,
    apartment_id: number,
    renter_id: number,
    start_date: string,
    end_date: string | null
}

export interface FullData {
    id: number,
    street: string,
    postcode: number,
    city: string,
    area: number,
    rooms: string,
    district: string,
    description: string,
    rent: number,
    available: string
}