import { ReportForm } from './ReportForm';
import type { ReportFormData } from './ReportForm';

interface AdditionalServiceFormProps {
    onCancel: () => void;
    onSubmit: (data: ReportFormData) => void;
}

const SERVICE_TYPES = [
    'Renovering',
    'Målning',
    'Golvbyte',
    'Köksupgradering',
    'Badrumsutrustning',
    'Övriga tjänster',
];

export const AdditionalServiceForm = ({ onCancel, onSubmit }: AdditionalServiceFormProps) => {
    const handleSubmit = (data: ReportFormData) => {
        onSubmit(data);
    };

    return (
        <ReportForm
            categories={SERVICE_TYPES}
            submitLabel="Skicka förfrågan"
            descriptionPlaceholder="Beskriv vilken tilläggsservice du är intresserad av..."
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    );
};
