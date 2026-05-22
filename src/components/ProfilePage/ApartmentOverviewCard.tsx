import { HouseLineIcon } from '@phosphor-icons/react';
import Button from '../ui/Button';

interface ApartmentOverviewCardProps {
    apartmentInfo: string[] | null;
    onErrorReport: () => void;
    onServiceRequest: () => void;
    onOpenContract: () => void;
    onOpenFloorPlan: () => void;
    imageSrc: string;
}

const ApartmentOverviewCard = ({
    apartmentInfo,
    onErrorReport,
    onServiceRequest,
    onOpenContract,
    onOpenFloorPlan,
    imageSrc,
}: ApartmentOverviewCardProps) => (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
        <div className='grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-stretch'>
            <div className='flex flex-col gap-6'>
                <div className='flex items-start gap-4'>
                    <div
                        className='mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100'
                        aria-hidden='true'
                    >
                        <HouseLineIcon size={20} className='text-neutral-500' />
                    </div>
                    <div>
                        <h2 className='text-lg font-semibold'>Bostadsinformation</h2>
                        {apartmentInfo ? (
                            <div className='mt-4 space-y-1 text-sm leading-6 text-gray-700'>
                                {apartmentInfo.map((info) => (
                                    <p key={info}>{info}</p>
                                ))}
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
                    <Button onClick={onErrorReport} variant='primary' size='md'>
                        Felanmälan
                    </Button>
                    <Button onClick={onServiceRequest} variant='primary' size='md'>
                        Efterfråga tilläggsservice
                    </Button>
                    <Button variant='primary' size='md' onClick={onOpenContract}>
                        Mitt kontrakt
                    </Button>
                    <Button variant='primary' size='md' onClick={onOpenFloorPlan}>
                        Planlösning
                    </Button>
                </div>
            </div>

            <div className='flex min-h-[280px] items-center justify-center rounded-2xl bg-neutral-200/70 text-neutral-400 overflow-hidden'>
                <img src={imageSrc} alt='Lägenhet' className='h-full w-full object-cover' />
            </div>
        </div>
    </section>
);

export default ApartmentOverviewCard;
