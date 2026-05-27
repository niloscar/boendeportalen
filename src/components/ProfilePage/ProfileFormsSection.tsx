import { ErrorReportForm } from './ErrorReportForm';
import { AdditionalServiceForm } from './AdditionalServiceForm';
import type { ReportFormData } from '../../types/forms';

export type ActiveForm = null | 'error' | 'service';

const FORM_TITLES: Record<NonNullable<ActiveForm>, string> = {
    error: 'Felanmälan',
    service: 'Efterfråga tilläggsservice',
};

const FORM_DESCRIPTIONS: Record<NonNullable<ActiveForm>, string> = {
    error: 'Vad tråkigt att något inte fungerar som det ska i din lägenhet. Fyll i formuläret så hjälper vi dig så fort vi kan.',
    service: 'Fyll i formuläret för att efterfråga en tilläggstjänst i din lägenhet, till exempel renovering eller vitvaror. Observera att tilläggsservice kan medföra en ökad månadshyra. Du kommer i så fall alltid att få information om kostnaden innan något beslutas, så att du kan ta ställning till om du vill gå vidare.',
};

interface ProfileFormsSectionProps {
    activeForm: ActiveForm;
    onCloseForm: () => void;
    onErrorSubmit: (data: ReportFormData) => void;
    onServiceSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

const ProfileFormsSection = ({
    activeForm,
    onCloseForm,
    onErrorSubmit,
    onServiceSubmit,
    isSubmitting,
}: ProfileFormsSectionProps) => {
    if (!activeForm) {
        return null;
    }

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8'>
            <h2 className='text-xl font-semibold text-neutral-900'>
                {FORM_TITLES[activeForm]}
            </h2>
            <p className='mt-2 mb-6 text-sm text-neutral-600'>
                {FORM_DESCRIPTIONS[activeForm]}
            </p>
            {activeForm === 'error' ? (
                <ErrorReportForm
                    onCancel={onCloseForm}
                    onSubmit={onErrorSubmit}
                    isSubmitting={isSubmitting}
                />
            ) : (
                <AdditionalServiceForm
                    onCancel={onCloseForm}
                    onSubmit={onServiceSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </section>
    );
};

export default ProfileFormsSection;
