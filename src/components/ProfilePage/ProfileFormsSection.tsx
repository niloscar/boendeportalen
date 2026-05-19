import { ErrorReportForm } from './ErrorReportForm';
import { AdditionalServiceForm } from './AdditionalServiceForm';
import type { ReportFormData } from './ReportForm';

export type ActiveForm = null | 'error' | 'service';

interface ProfileFormsSectionProps {
    activeForm: ActiveForm;
    onCloseForm: () => void;
    onErrorSubmit: (data: ReportFormData) => void;
    onServiceSubmit: (data: ReportFormData) => void;
}

const ProfileFormsSection = ({
    activeForm,
    onCloseForm,
    onErrorSubmit,
    onServiceSubmit,
}: ProfileFormsSectionProps) => {
    if (!activeForm) {
        return null;
    }

    return (
        <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8'>
            {activeForm === 'error' ? (
                <ErrorReportForm onCancel={onCloseForm} onSubmit={onErrorSubmit} />
            ) : (
                <AdditionalServiceForm onCancel={onCloseForm} onSubmit={onServiceSubmit} />
            )}
        </section>
    );
};

export default ProfileFormsSection;
