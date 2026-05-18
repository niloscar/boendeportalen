import Button from '../ui/Button';

interface ReportFormProps {
  categories: string[];
  submitLabel: string;
  descriptionPlaceholder: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  showExtras?: boolean;
}

export const ReportForm = ({
  categories,
  submitLabel,
  descriptionPlaceholder,
  onSubmit,
  onCancel,
  showExtras = false,
}: ReportFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-900">
          Ämnesrad *
        </label>
        <select
          required
          className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Välj ett ämne...</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-900">
          Plats i lägenheten *
        </label>
        <input
          required
          type="text"
          className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="T.ex. Köket, Sovrummet..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-900">
          Beskrivning *
        </label>
        <textarea
          required
          className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={5}
          placeholder={descriptionPlaceholder}
        />
      </div>

      {showExtras && (
        <div className="pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-semibold mb-4">Övrigt</h3>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium text-neutral-900">Annan lägesbeskrivning</label>
            <textarea
              className="w-full rounded-2xl bg-neutral-200 p-6 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
              placeholder="Annan lägesbeskrivning (valfritt)"
            />
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <label className="text-sm font-medium text-neutral-900">Övrigt</label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm">Får använda huvudnyckel</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm">Hund/Katt</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm">Kontakta mig först</span>
            </label>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium text-neutral-900">Bifoga fil</label>
            <input type="file" className="w-full rounded-2xl bg-white p-2 border border-neutral-300" />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" size="md" className="flex-1">
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onCancel}>
          Avbryt
        </Button>
      </div>
    </form>
  );
};
