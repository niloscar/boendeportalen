import { ReportForm } from './ReportForm';
import type { ReportFormData } from './ReportForm';

interface ErrorReportFormProps {
    onCancel: () => void;
    onSubmit: (data: ReportFormData) => void;
}

const ERROR_CATEGORIES = [
    'Vattenskada',
    'Elfel',
    'Mögel/Fukt',
    'Läckage',
    'Skador på vägg/golv',
    'Övriga fel',
];

export const ErrorReportForm = ({ onCancel, onSubmit }: ErrorReportFormProps) => {
    const handleSubmit = (data: ReportFormData) => {
        onSubmit(data);
    };

    return (
        <ReportForm
            categories={ERROR_CATEGORIES}
            submitLabel="Skicka felanmälan"
            descriptionPlaceholder="Beskriv vad som är trasigt..."
            onSubmit={handleSubmit}
            onCancel={onCancel}
            showExtras={true}
        />
    );
};
