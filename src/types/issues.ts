export type Issue = {
    id: number
    description: string
    category: string
    status: string
    created_at: string
    updated_at: string
    tenant_name: string
    tenant_phone: string
    has_pet: boolean
    street: string
    house_number: string
    stairwell?: string
    apartment_number: string
    location: string
}