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
    end_date: string,
    images: ApartmentImages[]
}
export interface Detail {
    id: number,
    title: string,
    content: string
}

export interface ApartmentImages {
    url: string,
    description: string
}

export type Filter = {
    rooms: string[],
    maxRent: number,
    district: string[],
    filtersVisibility: boolean,
    selectedRooms: React.ChangeEventHandler<HTMLInputElement>,
    changeRent: React.ChangeEventHandler<HTMLInputElement>,
    selectedDistrict: React.ChangeEventHandler<HTMLInputElement>,
    filterResults: React.MouseEventHandler<HTMLButtonElement>,
    setVisibility: (arg: boolean) => void;
}

export type ApartmentListProp =
  | {
      variant: 'div'
      items: ApartmentData[]
    }
  | {
      variant: 'ul'
      items: Detail[]
    }
export type ApartmentProp = {
    apartment: ApartmentData,
}
export type ApartmentImagesProp = {
    images: ApartmentImages[]
}

export type ListProp = {
    detail: Detail,
}
