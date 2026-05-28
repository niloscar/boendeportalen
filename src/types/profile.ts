import type { ChangeEvent } from 'react';
import type { ReportFormData } from './forms';

export interface Profile {
    id?: string
    role?: string
    isAdmin?: boolean
    email?: string | null
    full_name?: string | null
    avatar_url?: string
    [key: string]: unknown
}

export type NullableProfile = Profile | null

export type UserProfile = {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
};

export type ApartmentSummary = {
    id: number;
    street: string;
    postcode: number;
    city: string;
    area: string | null;
    rooms: string | null;
    district: string | null;
    description: string | null;
};

export type ContractSummary = {
    id: number;
    apartment_id: number;
    rent: number;
    start_date: string;
    end_date: string | null;
    status: 'active' | 'terminated' | 'pending';
    contract_file_path: string | null;
    apartments: ApartmentSummary | null;
};

export type ApartmentDocument = {
    id: number;
    apartment_id: number;
    title: string;
    file_path: string;
    document_type: 'floor_plan' | 'manual' | 'other';
    equipment_type: string | null;
    created_at: string;
};

export type ApartmentEquipment = {
    id: number;
    apartment_id: number;
    equipment_type: string;
};

export type ErrorReportRecord = {
    id: number;
};

export type ServiceRequestRecord = {
    id: number;
};

export type ErrorReportPayload = {
    category: string;
    subject: string;
    location: string;
    description: string;
    extra_location?: string;
    allow_master_key?: boolean;
    has_pet?: boolean;
    contact_first?: boolean;
};

export type ServiceRequestPayload = {
    service_type: string;
    location?: string;
    description: string;
};

export type ParkingSpotSummary = {
    id: number;
    address: string;
    city: string;
    postalCode: string;
    type: string;
    price: number;
};

export type AppliedParkingSummary = {
    applicationId: string;
    signUpDate: string;
    parking: ParkingSpotSummary;
};

export type AppliedApartmentSummary = {
    signUpId: number;
    endDate: string;
    rent: number | null;
    apartment: ApartmentSummary;
};

export interface ApartmentDocumentsSectionProps {
    documents: ApartmentDocument[];
    documentUrls: Record<number, string>;
}

export type ActiveForm = null | 'error' | 'service';

export interface AdditionalServiceFormProps {
    onCancel: () => void;
    onSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

export interface ApartmentOverviewCardProps {
    apartmentInfo: string[] | null;
    onErrorReport: () => void;
    onServiceRequest: () => void;
    onOpenContract: () => void;
    onOpenFloorPlan: () => void;
    imageSrc: string;
}

export interface AppliedApartmentsSectionProps {
    appliedApartments: AppliedApartmentSummary[];
}

export interface AppliedParkingSectionProps {
    appliedParking: AppliedParkingSummary[];
}

export interface ErrorReportFormProps {
    onCancel: () => void;
    onSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

export interface MyParkingSectionProps {
    myParking: ParkingSpotSummary[];
}

export interface PersonalInfoSectionProps {
    name: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    onSave: (data: { email: string; phone: string }) => Promise<void>;
    onAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ProfileFormsSectionProps {
    activeForm: ActiveForm;
    onCloseForm: () => void;
    onErrorSubmit: (data: ReportFormData) => void;
    onServiceSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

export interface ReportFormProps {
    categories: string[];
    submitLabel: string;
    descriptionPlaceholder: string;
    onSubmit: (data: ReportFormData) => void;
    onCancel: () => void;
    showExtras?: boolean;
    isSubmitting?: boolean;
}