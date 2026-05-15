export interface Apartment {
    id: number, street: string, postcode: number, city: string, area: string, rooms: string, district: string, description: string
}

export type ApartmentProps = {
    apartments: Apartment[]
    apartment: Apartment
}