import { HouseLineIcon } from '@phosphor-icons/react';
import { Temporal } from '@js-temporal/polyfill';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/calc';
import type { AppliedApartmentSummary } from '../../api/profilepageApi';
import type { ApartmentData, Detail } from '../../types/apartment';

interface AppliedApartmentsSectionProps {
    appliedApartments: AppliedApartmentSummary[];
}

const buildNavigationState = (item: AppliedApartmentSummary) => {
    const { apartment, endDate } = item;

    const apartmentData: ApartmentData = {
        id: apartment.id,
        street: apartment.street,
        postcode: apartment.postcode,
        city: apartment.city,
        area: Number(apartment.area) || 0,
        rooms: apartment.rooms ?? '',
        district: apartment.district ?? '',
        description: apartment.description ?? '',
        rent: 0,
        end_date: Temporal.PlainDate.from(endDate).subtract({ weeks: 2 }).toString(),
        images: [],
    };

    const details: Detail[] = [
        { id: '1', title: 'Adress', content: `${apartment.street}, ${apartment.city}` },
        ...(apartment.area ? [{ id: '2', title: 'Storlek', content: `${apartment.area} kvm` }] : []),
        ...(apartment.rooms ? [{ id: '3', title: 'Rum', content: apartment.rooms }] : []),
        ...(apartment.district ? [{ id: '4', title: 'Stadsdel', content: apartment.district }] : []),
    ];

    return { apartment: apartmentData, details };
};

const AppliedApartmentsSection = ({ appliedApartments }: AppliedApartmentsSectionProps) => {
    const navigate = useNavigate();

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
            <div className='flex items-start gap-4'>
                <div
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100'
                    aria-hidden='true'
                >
                    <HouseLineIcon size={20} className='text-neutral-500' />
                </div>
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold'>Sökta lägenheter</h2>

                    {appliedApartments.length > 0 ? (
                        <ul className='mt-4 flex flex-col gap-3'>
                            {appliedApartments.map((item) => (
                                <li key={item.signUpId}>
                                    <button
                                        onClick={() =>
                                            navigate(`/bostader/${item.apartment.id}`, {
                                                state: buildNavigationState(item),
                                            })
                                        }
                                        className='w-full rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-left text-sm transition hover:bg-neutral-200'
                                    >
                                        <span className='block font-medium text-neutral-900'>
                                            {item.apartment.street}, {item.apartment.city}
                                        </span>
                                        <span className='text-xs text-neutral-500'>
                                            {[
                                                item.apartment.area && `${item.apartment.area} kvm`,
                                                item.apartment.rooms && `${item.apartment.rooms} rum`,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </span>
                                        {item.rent !== null && (
                                            <span className='mt-1 block text-xs text-neutral-700'>
                                                Hyra: {formatNumber(item.rent)} kr/mån
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='mt-4 text-sm text-gray-600'>
                            Du har inga aktiva intresseanmälningar.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AppliedApartmentsSection;
