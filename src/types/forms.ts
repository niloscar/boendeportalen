export interface ReportFormData {
    category: string;
    location: string;
    description: string;
    extraLocation: string;
    allowMasterKey: boolean;
    hasPets: boolean;
    contactFirst: boolean;
    attachment: File | null;
}
