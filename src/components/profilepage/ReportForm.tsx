import React, { useEffect, useId, useRef, useState } from 'react';
import { PaperclipIcon, CaretDownIcon } from '@phosphor-icons/react';
import Button from '../ui/Button';

import type { ReportFormProps } from '../../types/profile';

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
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const inputBase = 'w-full rounded-2xl bg-neutral-100 p-4 focus:outline-none focus:ring-2';
    const inputValid = 'focus:ring-green-500';
    const inputError = 'ring-2 ring-red-400 focus:ring-red-400';

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" htmlFor={categoryId}>
                    Ämnesrad *
                </label>
                <div className="relative" ref={dropdownRef}>
                    <input type="hidden" name="category" value={selectedCategory} />
                    <button
                        id={categoryId}
                        type="button"
                        onClick={() => { setDropdownOpen((v) => !v); clearError('category'); }}
                        className={`${inputBase} flex items-center justify-between ${errors.category ? inputError : inputValid}`}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                    >
                        <span className={selectedCategory ? '' : 'text-neutral-400'}>
                            {selectedCategory || 'Välj ett ämne...'}
                        </span>
                        <CaretDownIcon
                            size={16}
                            className={`shrink-0 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </button>
                    {dropdownOpen && (
                        <ul
                            role="listbox"
                            className="absolute z-10 mt-1 w-full rounded-2xl border border-neutral-200 bg-white py-1 shadow-md overflow-hidden"
                        >
                            {categories.map((cat) => (
                                <li key={cat} role="option" aria-selected={selectedCategory === cat}>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); clearError('category'); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 ${selectedCategory === cat ? 'font-medium text-green-600' : 'text-neutral-900'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
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
                            Övriga upplysningar
                        </label>
                        <textarea
                            id={extraLocationId}
                            name="extraLocation"
                            className={`${inputBase} ${inputValid}`}
                            rows={3}
                            placeholder="Övriga upplysningar (valfritt)"
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
                        <span className="text-sm font-medium text-gray-700">Bifoga fil</span>
                        <input
                            ref={fileInputRef}
                            id={attachmentId}
                            name="attachment"
                            type="file"
                            className="hidden"
                            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 w-full rounded-2xl bg-neutral-100 p-4 hover:bg-neutral-200 transition-colors duration-200 cursor-pointer"
                        >
                            <PaperclipIcon size={16} className="shrink-0 text-neutral-500" />
                            <span className={`truncate ${fileName ? '' : 'text-neutral-400'}`}>{fileName ?? 'Välj fil...'}</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <Button
                    type="submit"
                    variant="green"
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
