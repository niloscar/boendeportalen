import { ReportForm } from './ReportForm';
import type { ErrorReportFormProps } from '../../types/profile';

const ERROR_CATEGORIES = [
    'Vattenskada',
    'Elfel',
    'Mögel/Fukt',
    'Läckage',
    'Skador på vägg/golv',
    'Övriga fel',
];

export const ErrorReportForm = ({ onCancel, onSubmit, isSubmitting }: ErrorReportFormProps) => (
    <ReportForm
        categories={ERROR_CATEGORIES}
        submitLabel="Skicka felanmälan"
        descriptionPlaceholder="Beskriv vad som är trasigt..."
        onSubmit={onSubmit}
        onCancel={onCancel}
        showExtras={true}
        isSubmitting={isSubmitting}
    />
);
