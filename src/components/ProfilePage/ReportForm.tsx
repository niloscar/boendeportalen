import { useId } from 'react';
import type { FormEvent } from 'react';
import Button from '../ui/Button';

export interface ReportFormData {
    category: string;
    location: string;
    description: string;
    extraLocation: string;
    allowMasterKey: boolean;
    hasPets: boolean;
    contactFirst: boolean;
    attachment: File | null;
}

interface ReportFormProps {
    categories: string[];
    submitLabel: string;
    descriptionPlaceholder: string;
    onSubmit: (data: ReportFormData) => void;
    onCancel: () => void;
    showExtras?: boolean;
}

export const ReportForm = ({
    categories,
    submitLabel,
    descriptionPlaceholder,
    onSubmit,
    onCancel,
    showExtras = false,
}: ReportFormProps) => {
    const idPrefix = useId();
    const categoryId = `${idPrefix}-category`;
    const locationId = `${idPrefix}-location`;
    const descriptionId = `${idPrefix}-description`;
    const extraLocationId = `${idPrefix}-extra-location`;
    const attachmentId = `${idPrefix}-attachment`;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const attachment = formData.get('attachment');
        const attachmentFile = attachment instanceof File && attachment.size > 0 ? attachment : null;

        onSubmit({
            category: String(formData.get('category') ?? ''),
            location: String(formData.get('location') ?? ''),
            description: String(formData.get('description') ?? ''),
            extraLocation: String(formData.get('extraLocation') ?? ''),
            allowMasterKey: formData.get('allowMasterKey') === 'on',
            hasPets: formData.get('hasPets') === 'on',
            contactFirst: formData.get('contactFirst') === 'on',
            attachment: attachmentFile,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900" htmlFor={categoryId}>
                    Ämnesrad *
                </label>
                <select
                    required
                    id={categoryId}
                    name="category"
                    className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Välj ett ämne...</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900" htmlFor={locationId}>
                    Plats i lägenheten *
                </label>
                <input
                    required
                    id={locationId}
                    name="location"
                    type="text"
                    className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="T.ex. Köket, Sovrummet..."
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900" htmlFor={descriptionId}>
                    Beskrivning *
                </label>
                <textarea
                    required
                    id={descriptionId}
                    name="description"
                    className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={5}
                    placeholder={descriptionPlaceholder}
                />
            </div>

            {showExtras && (
                <div className="pt-6 border-t border-neutral-200">
                    <h3 className="text-sm font-semibold mb-4">Övrigt</h3>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-neutral-900" htmlFor={extraLocationId}>
                            Annan lägesbeskrivning
                        </label>
                        <textarea
                            id={extraLocationId}
                            name="extraLocation"
                            className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={5}
                            placeholder="Annan lägesbeskrivning (valfritt)"
                        />
                    </div>

                    <fieldset className="flex flex-col gap-3 mb-4">
                        <legend className="text-sm font-medium text-neutral-900">Övrigt</legend>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" name="allowMasterKey" className="h-4 w-4" />
                            <span className="text-sm">Får använda huvudnyckel</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" name="hasPets" className="h-4 w-4" />
                            <span className="text-sm">Hund/Katt</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" name="contactFirst" className="h-4 w-4" />
                            <span className="text-sm">Kontakta mig först</span>
                        </label>
                    </fieldset>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-neutral-900" htmlFor={attachmentId}>
                            Bifoga fil
                        </label>
                        <input
                            id={attachmentId}
                            name="attachment"
                            type="file"
                            className="w-full rounded-2xl bg-white p-2 border border-neutral-300"
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                    {submitLabel}
                </Button>
                <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onCancel}>
                    Avbryt
                </Button>
            </div>
        </form>
    );
};
