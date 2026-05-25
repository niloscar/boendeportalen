import { ReportForm } from './ReportForm';
import type { ReportFormData } from './ReportForm';

interface AdditionalServiceFormProps {
    onCancel: () => void;
    onSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

const SERVICE_TYPES = [
    'Renovering',
    'Målning',
    'Golvbyte',
    'Köksupgradering',
    'Badrumsutrustning',
    'Övriga tjänster',
];

export const AdditionalServiceForm = ({ onCancel, onSubmit, isSubmitting }: AdditionalServiceFormProps) => (
    <ReportForm
        categories={SERVICE_TYPES}
        submitLabel="Skicka förfrågan"
        descriptionPlaceholder="Beskriv vilken tilläggsservice du är intresserad av..."
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
    />
);
