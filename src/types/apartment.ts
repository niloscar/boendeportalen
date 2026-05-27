import type React from 'react';

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
    id: string,
    title: string,
    content: string | number
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
    apartment: ApartmentData | null,
}
export type ApartmentImagesProp = {
    images: ApartmentImages[],
    size: string,
}

export type ListProp = {
    detail: Detail,
}

export interface SignedUpData {
    id: number,
    sign_up_date: string,
    apartment_id: number,
    end_date: string,
}

export type SignUp ={ 
    error: string,
    loading: boolean,
    applied: SignedUpData[],
    totalApplications: SignedUpData[],
    deleteSignUp: () => Promise<void>,
    signUp: () => Promise<void>
}