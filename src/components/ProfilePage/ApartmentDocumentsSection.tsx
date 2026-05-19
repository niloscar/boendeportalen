import type { ApartmentDocument } from '../../api/profilepageApi';

interface ApartmentDocumentsSectionProps {
    documents: ApartmentDocument[];
    getDocumentUrl: (filePath: string) => string;
}

const ApartmentDocumentsSection = ({
    documents,
    getDocumentUrl,
}: ApartmentDocumentsSectionProps) => (
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

                {documents.length > 0 ? (
                    <div className='mt-6 grid gap-3'>
                        {documents.map((doc) => (
                            <a
                                key={doc.id}
                                href={getDocumentUrl(doc.file_path)}
                                target='_blank'
                                rel='noreferrer'
                                className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200'
                            >
                                <span>{doc.title}</span>
                                <span className='text-xs text-gray-600'>PDF</span>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className='mt-6 text-sm text-gray-600'>Inga dokument uppladdade ännu.</p>
                )}
            </div>
        </div>
    </section>
);

export default ApartmentDocumentsSection;
