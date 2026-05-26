import { useMemo } from 'react';
import { InfoIcon } from '@phosphor-icons/react';
import type { ApartmentDocument } from '../../api/profilepageApi';

interface ApartmentDocumentsSectionProps {
    documents: ApartmentDocument[];
    documentUrls: Record<number, string>;
}

const CATEGORY_MAP: Record<string, string> = {
    dishwasher: 'Kök',
    stove: 'Kök',
    oven: 'Kök',
    refrigerator: 'Kök',
    freezer: 'Kök',
    microwave: 'Kök',
    washer: 'Badrum',
    dryer: 'Badrum',
};

const CATEGORY_ORDER = ['Allmänt', 'Kök', 'Badrum'];

const ApartmentDocumentsSection = ({
    documents,
    documentUrls,
}: ApartmentDocumentsSectionProps) => {
    const grouped = useMemo(() => {
        const groups: Record<string, ApartmentDocument[]> = {};
        for (const doc of documents) {
            const category = doc.equipment_type
                ? (CATEGORY_MAP[doc.equipment_type.toLowerCase()] ?? 'Allmänt')
                : 'Allmänt';
            if (!groups[category]) groups[category] = [];
            groups[category].push(doc);
        }
        return CATEGORY_ORDER
            .filter((cat) => groups[cat])
            .map((cat) => [cat, groups[cat]] as [string, ApartmentDocument[]]);
    }, [documents]);

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
            <div className='flex items-start gap-4'>
                <div
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100'
                    aria-hidden='true'
                >
                    <InfoIcon size={20} className='text-neutral-500' />
                </div>
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold'>Ta hand om din lägenhet</h2>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600'>
                        Nyttiga dokument om hur du tar hand om din lägenhet på bästa sätt
                    </p>

                    {grouped.length > 0 ? (
                        <div className='mt-6 space-y-6 sm:columns-2 sm:gap-6 sm:space-y-0'>
                            {grouped.map(([key, docs]) => (
                                <div key={key} className='mb-6 break-inside-avoid flex flex-col gap-2'>
                                    <h3 className='text-xs font-semibold uppercase tracking-wide text-neutral-500'>
                                        {key}
                                    </h3>
                                    {docs.map((doc) => {
                                        const url = documentUrls[doc.id];
                                        return url ? (
                                            <a
                                                key={doc.id}
                                                href={url}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200'
                                            >
                                                <span>{doc.title}</span>
                                                <span className='text-xs text-gray-500'>PDF</span>
                                            </a>
                                        ) : (
                                            <div
                                                key={doc.id}
                                                className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-400'
                                            >
                                                <span>{doc.title}</span>
                                                <span className='text-xs'>Ej tillgänglig</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='mt-6 text-sm text-gray-600'>Inga dokument uppladdade ännu.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ApartmentDocumentsSection;
