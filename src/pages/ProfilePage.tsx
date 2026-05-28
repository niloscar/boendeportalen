import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ReportFormData } from '../types/forms';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import Button from '../components/ui/Button';
import profilePageImage from '../assets/profilepage.webp';
import ApartmentOverviewCard from '../components/profilepage/ApartmentOverviewCard';
import AppliedApartmentsSection from '../components/profilepage/AppliedApartmentsSection';
import MyParkingSection from '../components/profilepage/MyParkingSection';
import AppliedParkingSection from '../components/profilepage/AppliedParkingSection';
import ApartmentDocumentsSection from '../components/profilepage/ApartmentDocumentsSection';
import PersonalInfoSection from '../components/profilepage/PersonalInfoSection';
import ProfileFormsSection from '../components/profilepage/ProfileFormsSection';
import ProfilePageSkeleton from '../components/profilepage/ProfilePageSkeleton';
import type { ActiveForm } from '../types/profile';
import useAuth from '../hooks/useAuth';
import { useProfileData } from '../hooks/useProfileData';
import {
    createErrorReport,
    createServiceRequest,
    getApartmentFileSignedUrl,
    getContractSignedUrl,
    updateUserProfile,
    uploadErrorReportAttachment,
    uploadAvatar,
} from '../api/profilepageApi';

const ProfilePage = () => {
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const { user, loading } = useAuth();
    const userId = user?.id ?? '';

    const {
        isLoading,
        loadError,
        clearLoadError,
        profile,
        setProfile,
        contract,
        documentUrls,
        apartmentInfo,
        manualDocuments,
        floorPlanDocument,
        appliedApartments,
        myParking,
        appliedParking,
    } = useProfileData(userId, loading);

    // Ref used to scroll the page back to top when a form subview opens
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (activeForm) {
            mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeForm]);

    const openForm = (form: ActiveForm) => {
        setSubmitMessage(null);
        setActiveForm(form);
    };

    const closeForm = () => {
        setActiveForm(null);
    };

    const handleErrorSubmit = async (data: ReportFormData) => {
        if (!userId || !contract?.apartment_id) {
            setSubmitMessage('Vi saknar uppgifter för att skapa felanmälan.');
            return;
        }

        setIsSubmitting(true);
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

            setActiveForm(null);
            setSubmitMessage('Felanmälan är mottagen. Vi återkommer inom kort.');
        } catch {
            setSubmitMessage('Felanmälan kunde inte skickas. Försök igen senare.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleServiceSubmit = async (data: ReportFormData) => {
        if (!userId || !contract?.apartment_id) {
            setSubmitMessage('Vi saknar uppgifter för att skapa förfrågan.');
            return;
        }

        setIsSubmitting(true);
        try {
            await createServiceRequest(userId, contract.apartment_id, {
                service_type: data.category,
                location: data.location,
                description: data.description,
            });

            setActiveForm(null);
            setSubmitMessage('Din förfrågan är mottagen. Vi återkommer inom kort.');
        } catch {
            setSubmitMessage('Förfrågan kunde inte skickas. Försök igen senare.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showUnavailableMessage = (label: string) => {
        setSubmitMessage(`${label} är inte tillgänglig ännu.`);
    };

    const openContract = async () => {
        try {
            const contractUrl = await getContractSignedUrl(contract?.contract_file_path ?? null);
            if (!contractUrl) {
                showUnavailableMessage('Mitt kontrakt');
                return;
            }
            window.open(contractUrl, '_blank', 'noreferrer');
        } catch {
            showUnavailableMessage('Mitt kontrakt');
        }
    };

    const openFloorPlan = async () => {
        try {
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
        } catch {
            showUnavailableMessage('Planlösning');
        }
    };

    const handleProfileSave = async (data: { email: string; phone: string }) => {
        try {
            const updated = await updateUserProfile(userId, { email: data.email, phone: data.phone });
            if (updated) setProfile(updated);
            setSubmitMessage('Dina uppgifter är uppdaterade.');
        } catch {
            setSubmitMessage('Uppgifterna kunde inte sparas. Försök igen senare.');
        }
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
        <div className='w-full text-neutral-900'>
            <main ref={mainRef} className='mx-auto flex w-full flex-col gap-8'>
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
                            <Button variant='secondary' size='md' onClick={clearLoadError}>
                                Stäng
                            </Button>
                        </div>
                    </section>
                )}

                {isLoading ? (
                    <ProfilePageSkeleton />
                ) : activeForm ? (
                    <>
                        <Button variant='secondary' size='md' onClick={closeForm} className='flex w-fit items-center gap-1.5'>
                            <ArrowLeftIcon size={16} />
                            Tillbaka
                        </Button>
                        <ProfileFormsSection
                            activeForm={activeForm}
                            onCloseForm={closeForm}
                            onErrorSubmit={handleErrorSubmit}
                            onServiceSubmit={handleServiceSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </>
                ) : (
                    <>
                        <PersonalInfoSection
                            name={profile?.full_name ?? null}
                            email={profile?.email ?? null}
                            phone={profile?.phone ?? null}
                            avatarUrl={profile?.avatar_url ?? null}
                            onSave={handleProfileSave}
                            onAvatarUpload={handleAvatarUpload}
                        />
                        {contract && (
                            <ApartmentOverviewCard
                                apartmentInfo={apartmentInfo}
                                onErrorReport={() => openForm('error')}
                                onServiceRequest={() => openForm('service')}
                                onOpenContract={openContract}
                                onOpenFloorPlan={openFloorPlan}
                                imageSrc={profilePageImage}
                            />
                        )}
                        {myParking.length > 0 && (
                            <MyParkingSection myParking={myParking} />
                        )}
                        {appliedParking.length > 0 && (
                            <AppliedParkingSection appliedParking={appliedParking} />
                        )}
                        {appliedApartments.length > 0 && (
                            <AppliedApartmentsSection appliedApartments={appliedApartments} />
                        )}
                        {contract && (
                            <ApartmentDocumentsSection
                                documents={manualDocuments}
                                documentUrls={documentUrls}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
