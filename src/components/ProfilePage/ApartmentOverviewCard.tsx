import { HouseLineIcon, FileTextIcon, NoteBlankIcon } from '@phosphor-icons/react';
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
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
        <div className='grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-stretch'>
            <div className='flex flex-col gap-6'>
                <div className='flex items-start gap-4'>
                    <div
                        className='mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500'
                        aria-hidden='true'
                    >
                        <HouseLineIcon size={20} weight='fill' className='text-white' />
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

                        <div className='mt-4 flex gap-4'>
                            <button
                                onClick={onOpenContract}
                                className='flex items-center gap-1.5 text-sm text-green-500 hover:text-green-700 transition-colors duration-200'
                            >
                                <FileTextIcon size={15} />
                                Mitt kontrakt
                            </button>
                            <button
                                onClick={onOpenFloorPlan}
                                className='flex items-center gap-1.5 text-sm text-green-500 hover:text-green-700 transition-colors duration-200'
                            >
                                <NoteBlankIcon size={15} />
                                Planlösning
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <Button onClick={onErrorReport} variant='primary' size='md'>
                        Felanmälan
                    </Button>
                    <Button onClick={onServiceRequest} variant='primary' size='md'>
                        Efterfråga tilläggsservice
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
