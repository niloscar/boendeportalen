import { useEffect, useMemo, useState } from 'react';
import { isNonEmptyString } from '../utils/strings';
import { formatNumber } from '../utils/calc';
import {
    getApartmentDocuments,
    getApartmentEquipment,
    getApartmentForUser,
    getApartmentFileSignedUrl,
    getAppliedApartments,
    getUserProfile,
} from '../api/profilepageApi';
import type {
    ApartmentDocument,
    ApartmentEquipment,
    AppliedApartmentSummary,
    ContractSummary,
    UserProfile,
} from '../api/profilepageApi';
import type React from 'react';

// Formats a Swedish postcode with a space separator: "12345" → "123 45"
const formatPostcode = (postcode?: string | number) => {
    if (postcode === undefined || postcode === null) return '';
    const str = String(postcode);
    const cleaned = str.replace(/\s+/g, '');
    if (cleaned.length === 5) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length === 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}`;
    return str;
};

export interface ProfileData {
    isLoading: boolean;
    loadError: string | null;
    clearLoadError: () => void;
    profile: UserProfile | null;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    contract: ContractSummary | null;
    documentUrls: Record<number, string>;
    apartmentInfo: string[] | null;
    manualDocuments: ApartmentDocument[];
    floorPlanDocument: ApartmentDocument | null;
    appliedApartments: AppliedApartmentSummary[];
}

/**
 * Loads and derives all profile page data for the given user.
 * Keeps ProfilePage free of data-fetching concerns.
 */
export function useProfileData(userId: string, authLoading: boolean): ProfileData {
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contract, setContract] = useState<ContractSummary | null>(null);
    const [documents, setDocuments] = useState<ApartmentDocument[]>([]);
    const [documentUrls, setDocumentUrls] = useState<Record<number, string>>({});
    const [equipment, setEquipment] = useState<ApartmentEquipment[]>([]);
    const [appliedApartments, setAppliedApartments] = useState<AppliedApartmentSummary[]>([]);

    useEffect(() => {
        const loadProfileData = async () => {
            if (authLoading) return;
            if (!userId) {
                setLoadError('Du behöver logga in för att se sidan.');
                return;
            }

            setIsLoading(true);
            setLoadError(null);

            try {
                // Fetch profile and apartment contract in parallel to minimize wait time
                const [profileData, contractData] = await Promise.all([
                    getUserProfile(userId),
                    getApartmentForUser(userId),
                ]);

                setProfile(profileData);
                setContract(contractData);

                const applied = await getAppliedApartments(userId);
                setAppliedApartments(applied);

                if (contractData?.apartment_id) {
                    const [documentsData, equipmentData] = await Promise.all([
                        getApartmentDocuments(contractData.apartment_id),
                        getApartmentEquipment(contractData.apartment_id),
                    ]);
                    setDocuments(documentsData);
                    setEquipment(equipmentData);

                    // Generate signed URLs for all documents concurrently
                    const signedUrls = await Promise.all(
                        documentsData.map(async (doc) => ({
                            id: doc.id,
                            url: await getApartmentFileSignedUrl(doc.file_path),
                        }))
                    );
                    const urlMap: Record<number, string> = {};
                    for (const { id, url } of signedUrls) {
                        if (url) urlMap[id] = url;
                    }
                    setDocumentUrls(urlMap);
                } else {
                    setDocuments([]);
                    setDocumentUrls({});
                }
            } catch {
                setLoadError('Kunde inte hämta profilinformation. Försök igen senare.');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileData();
    }, [authLoading, userId]);

    const equipmentTypes = useMemo(
        () => new Set(equipment.map((e) => e.equipment_type)),
        [equipment]
    );

    // Build the apartment info strings shown in ApartmentOverviewCard
    const apartmentInfo = useMemo(() => {
        if (!contract?.apartments) return null;

        const { apartments } = contract;
        const formattedPostcode = formatPostcode(apartments.postcode);
        const address = `Adress: ${apartments.street}, ${formattedPostcode} ${apartments.city}`;
        const area = `Storlek: ${apartments.area ? `${apartments.area} kvm` : null}`;
        const rooms = `Rum: ${apartments.rooms ? `${apartments.rooms} rum` : null}`;
        const rent = `Hyra: ${contract.rent ? `${formatNumber(contract.rent)} kr/mån` : null}`;

        return [address, area, rooms, rent].filter(isNonEmptyString);
    }, [contract]);

    // Only include manuals relevant to equipment actually present in the apartment
    const manualDocuments = useMemo(
        () =>
            documents.filter(
                (doc) =>
                    doc.document_type === 'manual' &&
                    (doc.equipment_type === null || equipmentTypes.has(doc.equipment_type))
            ),
        [documents, equipmentTypes]
    );

    const floorPlanDocument = useMemo(
        () => documents.find((doc) => doc.document_type === 'floor_plan') ?? null,
        [documents]
    );

    return {
        isLoading,
        loadError,
        clearLoadError: () => setLoadError(null),
        profile,
        setProfile,
        contract,
        documentUrls,
        apartmentInfo,
        manualDocuments,
        floorPlanDocument,
        appliedApartments,
    };
}
