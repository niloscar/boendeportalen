import axios from 'axios';
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
    created_at: string;
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

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabaseBaseUrl = (() => {
    const baseUrl = apiConfig.defaults.baseURL ?? '';
    return baseUrl.replace(/\/rest\/v1\/?$/, '');
})();

const storageBaseUrl = `${supabaseBaseUrl}/storage/v1`;

const getFirst = <T,>(items: T[]) => (items.length > 0 ? items[0] : null);

const toFileName = (name: string) => name.trim().replace(/\s+/g, '-');

const buildPublicUrl = (bucket: string, path: string) =>
    `${storageBaseUrl}/object/public/${bucket}/${encodeURI(path)}`;

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
    const uploadUrl = `${storageBaseUrl}/object/avatars/${filePath}`;

    await axios.post(uploadUrl, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
    });

    const publicUrl = buildPublicUrl('avatars', filePath);
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
            select: 'id,apartment_id,title,file_path,document_type,created_at',
            apartment_id: `eq.${apartmentId}`,
            order: 'created_at.desc',
        },
    });

    return response.data;
};

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
    const uploadUrl = `${storageBaseUrl}/object/report-attachments/${filePath}`;

    await axios.post(uploadUrl, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
    });

    const response = await apiConfig.post(
        '/error_report_attachments',
        {
            report_id: reportId,
            file_path: filePath,
        },
        { headers: { Prefer: 'return=representation' } }
    );

    return getFirst(response.data);
};

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

export const getPublicContractUrl = (filePath: string | null) => {
    if (!filePath) {
        return null;
    }

    return buildPublicUrl('contract-files', filePath);
};

export const getPublicApartmentFileUrl = (filePath: string) =>
    buildPublicUrl('apartment-files', filePath);
