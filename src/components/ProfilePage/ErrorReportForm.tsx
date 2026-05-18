import { ReportForm } from './ReportForm';

interface ErrorReportFormProps {
  onCancel: () => void;
}

// Mock data - kommer från databasen senare
const ERROR_CATEGORIES = [
  'Vattenskada',
  'Elfel',
  'Mögel/Fukt',
  'Läckage',
  'Skador på vägg/golv',
  'Övriga fel',
];

export const ErrorReportForm = ({ onCancel }: ErrorReportFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Lägg till submit-logik här
    console.log('Error report submitted');
  };

  return (
    <ReportForm
      categories={ERROR_CATEGORIES}
      submitLabel="Skicka felanmälan"
      descriptionPlaceholder="Beskriv vad som är trasigt..."
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
