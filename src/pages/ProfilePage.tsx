import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ReportFormData } from '../components/ProfilePage/ReportForm';
import Button from '../components/ui/Button';
import profilePageImage from '../assets/profilepage.webp';
import ApartmentOverviewCard from '../components/ProfilePage/ApartmentOverviewCard';
import ApartmentDocumentsSection from '../components/ProfilePage/ApartmentDocumentsSection';
import PersonalInfoSection from '../components/ProfilePage/PersonalInfoSection';
import ProfileFormsSection from '../components/ProfilePage/ProfileFormsSection';
import ProfilePageSkeleton from '../components/ProfilePage/ProfilePageSkeleton';
import type { ActiveForm } from '../components/ProfilePage/ProfileFormsSection';
import useAuth from '../hooks/useAuth';
import { isNonEmptyString } from '../utils/strings';
import {
    createErrorReport,
    createServiceRequest,
    getApartmentDocuments,
    getApartmentEquipment,
    getApartmentForUser,
    getApartmentFileSignedUrl,
    getContractSignedUrl,
    getUserProfile,
    updateUserProfile,
    uploadErrorReportAttachment,
    uploadAvatar,
} from '../api/profilepageApi';
import type { ApartmentDocument, ApartmentEquipment, ContractSummary, UserProfile } from '../api/profilepageApi';

const ProfilePage = () => {
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contract, setContract] = useState<ContractSummary | null>(null);
    const [documents, setDocuments] = useState<ApartmentDocument[]>([]);
    const [documentUrls, setDocumentUrls] = useState<Record<number, string>>({});
    const [equipment, setEquipment] = useState<ApartmentEquipment[]>([]);

    const { user, loading } = useAuth();
    const userId = user?.id ?? '';

    const formatPostcode = (postcode?: string | number) => {
        if (postcode === undefined || postcode === null) return '';
        const str = String(postcode);
        const cleaned = str.replace(/\s+/g, '');
        if (cleaned.length === 5) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        if (cleaned.length === 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}`;
        return str;
    };

    const formatRent = (rent?: number) => {
        if (typeof rent !== 'number') return '';
        return rent.toLocaleString('sv-SE');
    };

    const apartmentInfo = useMemo(() => {
        if (!contract?.apartments) return null;

        const { apartments } = contract;
        const formattedPostcode = formatPostcode(apartments.postcode);
        const address = `Adress: ${apartments.street}, ${formattedPostcode} ${apartments.city}`;
        const area = `Storlek: ${apartments.area ? `${apartments.area} kvm` : null}`;
        const rooms = `Rum: ${apartments.rooms ? `${apartments.rooms} rum` : null}`;
        const rent = `Hyra: ${contract.rent ? `${formatRent(contract.rent)} kr/mån` : null}`;

        return [address, area, rooms, rent].filter(isNonEmptyString);
    }, [contract]);

    const equipmentTypes = useMemo(
        () => new Set(equipment.map((e) => e.equipment_type)),
        [equipment]
    );

    const manualDocuments = useMemo(
        () => documents.filter(
            (doc) => doc.document_type === 'manual' &&
                (doc.equipment_type === null || equipmentTypes.has(doc.equipment_type))
        ),
        [documents, equipmentTypes]
    );

    const floorPlanDocument = useMemo(
        () => documents.find((doc) => doc.document_type === 'floor_plan') ?? null,
        [documents]
    );

    useEffect(() => {
        const loadProfileData = async () => {
            if (loading) return;
            if (!userId) {
                setLoadError('Du behöver logga in för att se sidan.');
                return;
            }

            setIsLoading(true);
            setLoadError(null);

            try {
                const [profileData, contractData] = await Promise.all([
                    getUserProfile(userId),
                    getApartmentForUser(userId),
                ]);

                setProfile(profileData);
                setContract(contractData);

                if (contractData?.apartment_id) {
                    const [documentsData, equipmentData] = await Promise.all([
                        getApartmentDocuments(contractData.apartment_id),
                        getApartmentEquipment(contractData.apartment_id),
                    ]);
                    setDocuments(documentsData);
                    setEquipment(equipmentData);

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
    }, [loading, userId]);

    const toggleForm = (form: ActiveForm) => {
        setActiveForm((current) => (current === form ? null : form));
    };

    const handleErrorSubmit = async (data: ReportFormData) => {
        if (!userId || !contract?.apartment_id) {
            setSubmitMessage('Vi saknar uppgifter för att skapa felanmälan.');
            return;
        }

        try {
            const report = await createErrorReport(userId, contract.apartment_id, {
                category: data.category,
                subject: data.category,
                location: data.location,
                description: data.description,
                extra_location: data.extraLocation,
                allow_master_key: data.allowMasterKey,
                has_pet: data.hasPets,
                contact_first: data.contactFirst,
            });

            if (report?.id && data.attachment) {
                await uploadErrorReportAttachment(report.id, data.attachment);
            }

            setSubmitMessage('Felanmälan är mottagen. Vi återkommer inom kort.');
            setActiveForm(null);
        } catch {
            setSubmitMessage('Felanmälan kunde inte skickas. Försök igen senare.');
        }
    };

    const handleServiceSubmit = async (data: ReportFormData) => {
        if (!userId || !contract?.apartment_id) {
            setSubmitMessage('Vi saknar uppgifter för att skapa förfrågan.');
            return;
        }

        try {
            await createServiceRequest(userId, contract.apartment_id, {
                service_type: data.category,
                location: data.location,
                description: data.description,
            });

            setSubmitMessage('Din förfrågan är mottagen. Vi återkommer inom kort.');
            setActiveForm(null);
        } catch {
            setSubmitMessage('Förfrågan kunde inte skickas. Försök igen senare.');
        }
    };

    const showUnavailableMessage = (label: string) => {
        setSubmitMessage(`${label} är inte tillgänglig ännu.`);
    };

    const openContract = async () => {
        const contractUrl = await getContractSignedUrl(contract?.contract_file_path ?? null);

        if (!contractUrl) {
            showUnavailableMessage('Mitt kontrakt');
            return;
        }

        window.open(contractUrl, '_blank', 'noreferrer');
    };

    const openFloorPlan = async () => {
        if (!floorPlanDocument) {
            showUnavailableMessage('Planlösning');
            return;
        }

        const url = await getApartmentFileSignedUrl(floorPlanDocument.file_path);
        if (!url) {
            showUnavailableMessage('Planlösning');
            return;
        }

        window.open(url, '_blank', 'noreferrer');
    };

    const handleProfileSave = async (data: { email: string; phone: string }) => {
        const updated = await updateUserProfile(userId, { email: data.email, phone: data.phone });
        if (updated) setProfile(updated);
        setSubmitMessage('Dina uppgifter är uppdaterade.');
    };

    const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !userId) return;

        try {
            const avatarUrl = await uploadAvatar(userId, file);
            setProfile((current) => (current ? { ...current, avatar_url: avatarUrl } : current));
            setSubmitMessage('Din profilbild är uppdaterad.');
        } catch {
            setSubmitMessage('Profilbilden kunde inte uppdateras. Försök igen.');
        }
    };

    return (
        <div className='min-h-screen bg-neutral-100 text-neutral-900'>
            <main className='mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 sm:px-10'>
{submitMessage && (
                    <section
                        className='rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900'
                        role='status'
                        aria-live='polite'
                    >
                        <div className='flex items-center justify-between gap-4'>
                            <p>{submitMessage}</p>
                            <Button variant='secondary' size='md' onClick={() => setSubmitMessage(null)}>
                                Stäng
                            </Button>
                        </div>
                    </section>
                )}

                {loadError && (
                    <section
                        className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900'
                        role='status'
                        aria-live='polite'
                    >
                        <div className='flex items-center justify-between gap-4'>
                            <p>{loadError}</p>
                            <Button variant='secondary' size='md' onClick={() => setLoadError(null)}>
                                Stäng
                            </Button>
                        </div>
                    </section>
                )}

                {isLoading ? (
                    <ProfilePageSkeleton />
                ) : (
                    <>
                        <ApartmentOverviewCard
                            apartmentInfo={apartmentInfo}
                            onErrorReport={() => toggleForm('error')}
                            onServiceRequest={() => toggleForm('service')}
                            onOpenContract={openContract}
                            onOpenFloorPlan={openFloorPlan}
                            imageSrc={profilePageImage}
                        />

                        <ProfileFormsSection
                            activeForm={activeForm}
                            onCloseForm={() => setActiveForm(null)}
                            onErrorSubmit={handleErrorSubmit}
                            onServiceSubmit={handleServiceSubmit}
                        />

                        <ApartmentDocumentsSection
                            documents={manualDocuments}
                            documentUrls={documentUrls}
                        />

                        <PersonalInfoSection
                            name={profile?.full_name ?? null}
                            email={profile?.email ?? null}
                            phone={profile?.phone ?? null}
                            avatarUrl={profile?.avatar_url ?? null}
                            onSave={handleProfileSave}
                            onAvatarUpload={handleAvatarUpload}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
