import { ErrorReportForm } from './ErrorReportForm';
import { AdditionalServiceForm } from './AdditionalServiceForm';
import type { ReportFormData } from './ReportForm';

export type ActiveForm = null | 'error' | 'service';

const FORM_TITLES: Record<NonNullable<ActiveForm>, string> = {
    error: 'Felanmälan',
    service: 'Efterfråga tilläggsservice',
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
            <h2 className='mb-6 text-xl font-semibold text-neutral-900'>
                {FORM_TITLES[activeForm]}
            </h2>
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
