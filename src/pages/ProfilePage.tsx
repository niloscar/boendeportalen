import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ReportFormData } from '../components/ProfilePage/ReportForm';
import Button from '../components/ui/Button';
import profilePageImage from '../assets/profilepage.webp';
import ApartmentOverviewCard from '../components/ProfilePage/ApartmentOverviewCard';
import ApartmentDocumentsSection from '../components/ProfilePage/ApartmentDocumentsSection';
import PersonalInfoSection from '../components/ProfilePage/PersonalInfoSection';
import ProfileFormsSection from '../components/ProfilePage/ProfileFormsSection';
import type { ActiveForm } from '../components/ProfilePage/ProfileFormsSection';
import useAuth from '../hooks/useAuth';
import {
    createErrorReport,
    createServiceRequest,
    getApartmentDocuments,
    getApartmentForUser,
    getPublicApartmentFileUrl,
    getPublicContractUrl,
    getUserProfile,
    uploadErrorReportAttachment,
    uploadAvatar,
} from '../api/profilepageApi';
import type { ApartmentDocument, ContractSummary, UserProfile } from '../api/profilepageApi';

const isNonEmptyString = (value: string | null | undefined): value is string =>
    Boolean(value && value.trim().length > 0);

const ProfilePage = () => {
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contract, setContract] = useState<ContractSummary | null>(null);
    const [documents, setDocuments] = useState<ApartmentDocument[]>([]);

    const { user, loading } = useAuth();
    const userId = user?.id ?? '';

    const apartmentInfo = useMemo(() => {
        if (!contract?.apartments) {
            return null;
        }

        const { apartments } = contract;
        const address = `${apartments.street}, ${apartments.postcode} ${apartments.city}`;
        const area = apartments.area ? `${apartments.area} kvm` : null;
        const rooms = apartments.rooms ? `${apartments.rooms} rum` : null;
        const rent = contract.rent ? `${contract.rent} kr/mån` : null;

        return [address, area, rooms, rent].filter(isNonEmptyString);
    }, [contract]);

    const personalInfo = useMemo(() => {
        if (!profile) {
            return null;
        }

        return [profile.full_name, profile.email, profile.phone].filter(isNonEmptyString);
    }, [profile]);

    const manualDocuments = useMemo(
        () => documents.filter((doc) => doc.document_type === 'manual'),
        [documents]
    );

    const floorPlanDocument = useMemo(
        () => documents.find((doc) => doc.document_type === 'floor_plan') ?? null,
        [documents]
    );

    useEffect(() => {
        const loadProfileData = async () => {
            if (loading) {
                return;
            }
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
                    const documentsData = await getApartmentDocuments(contractData.apartment_id);
                    setDocuments(documentsData);
                } else {
                    setDocuments([]);
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

    const openContract = () => {
        const contractUrl = getPublicContractUrl(contract?.contract_file_path ?? null);

        if (!contractUrl) {
            showUnavailableMessage('Mitt kontrakt');
            return;
        }

        window.open(contractUrl, '_blank', 'noreferrer');
    };

    const openFloorPlan = () => {
        if (!floorPlanDocument) {
            showUnavailableMessage('Planlösning');
            return;
        }

        window.open(getPublicApartmentFileUrl(floorPlanDocument.file_path), '_blank', 'noreferrer');
    };

    const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !userId) {
            return;
        }

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
            <header className='flex items-center justify-between px-6 py-5 sm:px-10'>
                <div className='text-lg font-semibold tracking-wide'>Logo</div>
                <Button
                    variant='primary'
                    size='md'
                    className='px-5 py-2 text-sm'
                    onClick={() => showUnavailableMessage('Meny')}
                >
                    Meny
                </Button>
            </header>

            <main className='mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 sm:px-10'>
                <section className='pt-2 text-center'>
                    <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                        Min lägenhet
                    </h1>
                </section>

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

                {isLoading && (
                    <section className='rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-gray-700'>
                        Hämtar dina uppgifter...
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
                    getDocumentUrl={getPublicApartmentFileUrl}
                />

                <PersonalInfoSection
                    personalInfo={personalInfo}
                    onEditProfile={() => showUnavailableMessage('Ändra uppgifter')}
                    onAvatarUpload={handleAvatarUpload}
                />
            </main>
        </div>
    );
};

export default ProfilePage;