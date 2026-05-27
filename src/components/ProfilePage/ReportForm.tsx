import React, { useId, useState } from 'react';
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
    isSubmitting?: boolean;
}

type FormErrors = Partial<Record<'category' | 'location' | 'description', string>>;

export const ReportForm = ({
    categories,
    submitLabel,
    descriptionPlaceholder,
    onSubmit,
    onCancel,
    showExtras = false,
    isSubmitting = false,
}: ReportFormProps) => {
    const idPrefix = useId();
    const categoryId = `${idPrefix}-category`;
    const locationId = `${idPrefix}-location`;
    const descriptionId = `${idPrefix}-description`;
    const extraLocationId = `${idPrefix}-extra-location`;
    const attachmentId = `${idPrefix}-attachment`;

    const [errors, setErrors] = useState<FormErrors>({});

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const category = String(formData.get('category') ?? '');
        const location = String(formData.get('location') ?? '');
        const description = String(formData.get('description') ?? '');

        const newErrors: FormErrors = {};
        if (!category) newErrors.category = 'Välj ett ämne';
        if (!location) newErrors.location = 'Ange plats i lägenheten';
        if (!description) newErrors.description = 'Ange en beskrivning';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const attachment = formData.get('attachment');
        const attachmentFile = attachment instanceof File && attachment.size > 0 ? attachment : null;

        onSubmit({
            category,
            location,
            description,
            extraLocation: String(formData.get('extraLocation') ?? ''),
            allowMasterKey: formData.get('allowMasterKey') === 'on',
            hasPets: formData.get('hasPets') === 'on',
            contactFirst: formData.get('contactFirst') === 'on',
            attachment: attachmentFile,
        });
    };

    const inputBase = 'w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2';
    const inputValid = 'focus:ring-green-500';
    const inputError = 'ring-2 ring-red-400 focus:ring-red-400';

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor={categoryId}>
                    Ämnesrad *
                </label>
                <select
                    id={categoryId}
                    name="category"
                    className={`${inputBase} ${errors.category ? inputError : inputValid}`}
                    onChange={() => clearError('category')}
                >
                    <option value="">Välj ett ämne...</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-xs text-red-500" role="alert">{errors.category}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor={locationId}>
                    Plats i lägenheten *
                </label>
                <input
                    id={locationId}
                    name="location"
                    type="text"
                    className={`${inputBase} ${errors.location ? inputError : inputValid}`}
                    placeholder="T.ex. Köket, Sovrummet..."
                    onChange={() => clearError('location')}
                />
                {errors.location && (
                    <p className="text-xs text-red-500" role="alert">{errors.location}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor={descriptionId}>
                    Beskrivning *
                </label>
                <textarea
                    id={descriptionId}
                    name="description"
                    className={`${inputBase} ${errors.description ? inputError : inputValid}`}
                    rows={5}
                    placeholder={descriptionPlaceholder}
                    onChange={() => clearError('description')}
                />
                {errors.description && (
                    <p className="text-xs text-red-500" role="alert">{errors.description}</p>
                )}
            </div>

            {showExtras && (
                <div className="border-t border-neutral-200 pt-6">
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-gray-700" htmlFor={extraLocationId}>
                            Annan lägesbeskrivning
                        </label>
                        <textarea
                            id={extraLocationId}
                            name="extraLocation"
                            className={`${inputBase} ${inputValid}`}
                            rows={3}
                            placeholder="Annan lägesbeskrivning (valfritt)"
                        />
                    </div>

                    <fieldset className="flex flex-col gap-3 mb-4">
                        <legend className="text-sm font-medium text-gray-700 mb-1">Övrigt</legend>
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

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor={attachmentId}>
                            Bifoga fil
                        </label>
                        <input
                            id={attachmentId}
                            name="attachment"
                            type="file"
                            className="w-full rounded-2xl bg-white p-2 border border-neutral-300 cursor-pointer"
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Skickar...' : submitLabel}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Avbryt
                </Button>
            </div>
        </form>
    );
};
