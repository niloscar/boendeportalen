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

export type Filter =  {
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
