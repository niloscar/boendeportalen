export interface ApartmentData {
    id: number,
    street: string,
    postcode: number,
    city: string,
    area: number,
    rooms: string,
    district: string,
    description: string,
    rent: number,
    end_date: string
}

export interface ApartmentImages {
    url: string,
    description: string
}