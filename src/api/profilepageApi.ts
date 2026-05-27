import { supabase } from '../lib/supabase';
import apiConfig from './axiosConfig.ts';

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

// Sanitizes a file name for Supabase Storage: strips diacritics, replaces
// non-alphanumeric characters with hyphens, and collapses duplicate hyphens.
const toFileName = (name: string) =>
    name
        .trim()
        .normalize('NFD')
        .replace(/\p{Mn}/gu, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');

// Returns the first element of an array, or null if the array is empty.
// PostgREST always returns arrays; single-row queries use this helper.
const getFirst = <T,>(items: T[]) => (items.length > 0 ? items[0] : null);

export const getUserProfile = async (userId: string) => {
    const response = await apiConfig.get<UserProfile[]>('/users', {
        params: {
            select: 'id,full_name,email,phone,avatar_url',
            id: `eq.${userId}`,
            limit: 1,
        },
    });

    return getFirst(response.data);
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    const response = await apiConfig.patch<UserProfile[]>(
        '/users',
        updates,
        {
            params: { id: `eq.${userId}` },
            headers: { Prefer: 'return=representation' },
        }
    );

    return getFirst(response.data);
};

export const uploadAvatar = async (userId: string, file: File) => {
    const filePath = `${userId}/${Date.now()}-${toFileName(file.name)}`;

    const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    await updateUserProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
};

export const getApartmentForUser = async (userId: string) => {
    const response = await apiConfig.get<ContractSummary[]>('/contracts', {
        params: {
            select: [
                'id',
                'apartment_id',
                'rent',
                'start_date',
                'end_date',
                'status',
                'contract_file_path',
                'apartments(id,street,postcode,city,area,rooms,district,description)',
            ].join(','),
            tenant_id: `eq.${userId}`,
            status: 'eq.active',
            limit: 1,
        },
    });

    return getFirst(response.data);
};

export const getApartmentDocuments = async (apartmentId: number) => {
    const response = await apiConfig.get<ApartmentDocument[]>('/apartment_documents', {
        params: {
            select: 'id,apartment_id,title,file_path,document_type,equipment_type,created_at',
            apartment_id: `eq.${apartmentId}`,
            order: 'created_at.desc',
        },
    });

    return response.data;
};

export const getApartmentEquipment = async (apartmentId: number) => {
    const response = await apiConfig.get<ApartmentEquipment[]>('/apartment_equipment', {
        params: {
            select: 'id,apartment_id,equipment_type',
            apartment_id: `eq.${apartmentId}`,
        },
    });

    return response.data;
};

// Inserts a new error report. Requires an RLS policy on error_reports that allows
// INSERT when tenant_id = (SELECT auth.uid()).
export const createErrorReport = async (
    userId: string,
    apartmentId: number,
    payload: ErrorReportPayload
) => {
    const response = await apiConfig.post<ErrorReportRecord[]>(
        '/error_reports',
        {
            tenant_id: userId,
            apartment_id: apartmentId,
            category: payload.category,
            subject: payload.subject,
            location: payload.location,
            description: payload.description,
            extra_location: payload.extra_location ?? null,
            allow_master_key: payload.allow_master_key ?? false,
            has_pet: payload.has_pet ?? false,
            contact_first: payload.contact_first ?? false,
        },
        { headers: { Prefer: 'return=representation' } }
    );

    return getFirst(response.data);
};

export const uploadErrorReportAttachment = async (reportId: number, file: File) => {
    const filePath = `${reportId}/${Date.now()}-${toFileName(file.name)}`;

    const { error } = await supabase.storage
        .from('report-attachments')
        .upload(filePath, file);

    if (error) throw error;

    const response = await apiConfig.post(
        '/error_report_attachments',
        { report_id: reportId, file_path: filePath },
        { headers: { Prefer: 'return=representation' } }
    );

    return getFirst(response.data);
};

// Inserts a new service request. Requires an RLS policy on service_requests that allows
// INSERT when tenant_id = (SELECT auth.uid()).
export const createServiceRequest = async (
    userId: string,
    apartmentId: number,
    payload: ServiceRequestPayload
) => {
    const response = await apiConfig.post<ServiceRequestRecord[]>(
        '/service_requests',
        {
            tenant_id: userId,
            apartment_id: apartmentId,
            service_type: payload.service_type,
            location: payload.location ?? null,
            description: payload.description,
        },
        { headers: { Prefer: 'return=representation' } }
    );

    return getFirst(response.data);
};

// Generates a signed URL valid for 1 hour from the private contract storage bucket.
// Returns null if no file path is stored on the contract.
export const getContractSignedUrl = async (filePath: string | null): Promise<string | null> => {
    if (!filePath) return null;

    const { data, error } = await supabase.storage
        .from('contract-files')
        .createSignedUrl(filePath, 3600);

    if (error || !data) return null;
    return data.signedUrl;
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

export const getAppliedApartments = async (userId: string): Promise<AppliedApartmentSummary[]> => {
    const signUpsResponse = await apiConfig.get<Array<{ id: number; end_date: string; apartment_id: number }>>('/apartment_sign_up', {
        params: {
            select: 'id,end_date,apartment_id',
            user_id: `eq.${userId}`,
        },
    });

    const signUps = signUpsResponse.data;
    if (signUps.length === 0) return [];

    const apartmentIds = signUps.map((s) => s.apartment_id);
    const apartmentsResponse = await apiConfig.get<ApartmentSummary[]>('/apartments', {
        params: {
            select: 'id,street,postcode,city,area,rooms,district,description',
            id: `in.(${apartmentIds.join(',')})`,
        },
    });

    const apartmentsMap = new Map(apartmentsResponse.data.map((a) => [a.id, a]));

    const availableResponse = await apiConfig.get<Array<{ id: number; rent: number }>>('/available_apartments', {
        params: {
            select: 'id,rent',
            id: `in.(${apartmentIds.join(',')})`,
        },
    });
    const rentMap = new Map(availableResponse.data.map((a) => [a.id, a.rent]));

    return signUps
        .filter((s) => apartmentsMap.has(s.apartment_id))
        .map((s) => ({
            signUpId: s.id,
            endDate: s.end_date,
            rent: rentMap.get(s.apartment_id) ?? null,
            apartment: apartmentsMap.get(s.apartment_id)!,
        }));
};

export const getMyParking = async (userId: string): Promise<ParkingSpotSummary[]> => {
    const response = await apiConfig.get<Array<{
        id: number;
        address: string;
        city: string;
        postal_code: string;
        spot_type: string;
        price: number;
    }>>('/parking_spots', {
        params: {
            select: 'id,address,city,postal_code,spot_type,price',
            renter: `eq.${userId}`,
        },
    });

    return response.data.map((row) => ({
        id: row.id,
        address: row.address,
        city: row.city,
        postalCode: row.postal_code,
        type: row.spot_type,
        price: row.price,
    }));
};

export const getAppliedParking = async (userId: string): Promise<AppliedParkingSummary[]> => {
    const appsResponse = await apiConfig.get<Array<{
        id: string;
        sign_up_date: string;
        parking_id: number;
    }>>('/parking_applications', {
        params: {
            select: 'id,sign_up_date,parking_id',
            user_id: `eq.${userId}`,
        },
    });

    const apps = appsResponse.data;
    if (apps.length === 0) return [];

    const parkingIds = apps.map((a) => a.parking_id);
    const spotsResponse = await apiConfig.get<Array<{
        id: number;
        address: string;
        city: string;
        postal_code: string;
        spot_type: string;
        price: number;
    }>>('/parking_spots', {
        params: {
            select: 'id,address,city,postal_code,spot_type,price',
            id: `in.(${parkingIds.join(',')})`,
        },
    });

    const spotsMap = new Map(spotsResponse.data.map((s) => [s.id, s]));

    return apps
        .filter((a) => spotsMap.has(a.parking_id))
        .map((a) => {
            const spot = spotsMap.get(a.parking_id)!;
            return {
                applicationId: a.id,
                signUpDate: a.sign_up_date,
                parking: {
                    id: spot.id,
                    address: spot.address,
                    city: spot.city,
                    postalCode: spot.postal_code,
                    type: spot.spot_type,
                    price: spot.price,
                },
            };
        });
};

// Generates a signed URL valid for 1 hour for apartment documents (manuals, floor plans).
export const getApartmentFileSignedUrl = async (filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
        .from('apartment-files')
        .createSignedUrl(filePath, 3600);

    if (error || !data) return null;
    return data.signedUrl;
};
