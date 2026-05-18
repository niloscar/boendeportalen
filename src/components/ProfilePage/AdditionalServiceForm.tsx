import { ReportForm } from './ReportForm';

interface AdditionalServiceFormProps {
  onCancel: () => void;
}

// Mock data - will come from the database later
const SERVICE_TYPES = [
  'Renovering',
  'Målning',
  'Golvbyte',
  'Köksupgradering',
  'Badrumsutrustning',
  'Övriga tjänster',
];

export const AdditionalServiceForm = ({ onCancel }: AdditionalServiceFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add submit logic here
    console.log('Additional service request submitted');
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
