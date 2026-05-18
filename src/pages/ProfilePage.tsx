import { useState } from 'react';
import { ErrorReportForm } from '../components/ProfilePage/ErrorReportForm';
import { AdditionalServiceForm } from '../components/ProfilePage/AdditionalServiceForm';
import Button from '../components/ui/Button';
import profilePageImage from '../assets/profilepage.webp';

type ActiveForm = null | 'error' | 'service';

const ProfilePage = () => {
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const apartmentInfo = null;
    const personalInfo = null;

    const toggleForm = (form: ActiveForm) => {
        setActiveForm((current) => (current === form ? null : form));
    };

    const handleErrorSubmit = () => {
        setSubmitMessage('Felanmälan är mottagen. Vi återkommer inom kort.');
        setActiveForm(null);
    };

    const handleServiceSubmit = () => {
        setSubmitMessage('Din förfrågan är mottagen. Vi återkommer inom kort.');
        setActiveForm(null);
    };

    const showUnavailableMessage = (label: string) => {
        setSubmitMessage(`${label} är inte tillgänglig ännu.`);
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

                <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
                    <div className='grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-stretch'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-start gap-4'>
                                <div
                                    className='mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-2xl text-neutral-500'
                                    aria-hidden='true'
                                >
                                    ⌂
                                </div>
                                <div>
                                    <h2 className='text-lg font-semibold'>Bostadsinformation</h2>
                                    {apartmentInfo ? (
                                        <div className='mt-4 space-y-1 text-sm leading-6 text-gray-700'>
                                            <p>{apartmentInfo}</p>
                                        </div>
                                    ) : (
                                        <div className='mt-4 space-y-1 text-sm leading-6 text-gray-600'>
                                            <p>Adress saknas</p>
                                            <p>Storlek saknas</p>
                                            <p>Rum och kök saknas</p>
                                            <p>Hyra saknas</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                                <Button onClick={() => toggleForm('error')} variant='primary' size='md'>
                                    Felanmälan
                                </Button>
                                <Button onClick={() => toggleForm('service')} variant='primary' size='md'>
                                    Efterfråga tilläggsservice
                                </Button>
                                <Button variant='primary' size='md' onClick={() => showUnavailableMessage('Mitt kontrakt')}>
                                    Mitt kontrakt
                                </Button>
                                <Button variant='primary' size='md' onClick={() => showUnavailableMessage('Planlösning')}>
                                    Planlösning
                                </Button>
                            </div>
                        </div>

                        <div className='flex min-h-[280px] items-center justify-center rounded-2xl bg-neutral-200/70 text-neutral-400 overflow-hidden'>
                            <img src={profilePageImage} alt='Lägenhet' className='w-full h-full object-cover' />
                        </div>
                    </div>
                </section>

                {activeForm !== null && (
                    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
                        {activeForm === 'error' ? (
                            <ErrorReportForm
                                onCancel={() => setActiveForm(null)}
                                onSubmit={handleErrorSubmit}
                            />
                        ) : (
                            <AdditionalServiceForm
                                onCancel={() => setActiveForm(null)}
                                onSubmit={handleServiceSubmit}
                            />
                        )}
                    </section>
                )}

                <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
                    <div className='flex items-start gap-4'>
                        <div
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-500'
                            aria-hidden='true'
                        >
                            i
                        </div>
                        <div className='flex-1'>
                            <h2 className='text-lg font-semibold'>Ta hand om din lägenhet</h2>
                            <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600'>
                                Nyttiga dokument om hur du tar hand om din lägenhet på bästa sätt
                            </p>

                            <div className='mt-6 grid gap-4 md:grid-cols-3'>
                                <Button variant='primary' size='md' onClick={() => showUnavailableMessage('Kök')}>
                                    Kök
                                </Button>
                                <Button variant='primary' size='md' onClick={() => showUnavailableMessage('Badrum')}>
                                    Badrum
                                </Button>
                                <Button variant='primary' size='md' onClick={() => showUnavailableMessage('Ventilation')}>
                                    Ventilation
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
                    <div className='flex items-start gap-4'>
                        <div
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-500'
                            aria-hidden='true'
                        >
                            ⍰
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold'>Mina uppgifter</h2>
                            {personalInfo ? (
                                <div className='mt-5 space-y-1 text-sm leading-6 text-gray-700'>
                                    <p>{personalInfo}</p>
                                </div>
                            ) : (
                                <p className='mt-5 text-sm leading-6 text-gray-600'>
                                    Inga personuppgifter tillgängliga.
                                </p>
                            )}

                            <Button
                                className='mt-6'
                                variant='primary'
                                size='md'
                                onClick={() => showUnavailableMessage('Ändra uppgifter')}
                            >
                                Ändra uppgifter
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;