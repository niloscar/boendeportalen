interface ReportFormProps {
  categories: string[];
  submitLabel: string;
  descriptionPlaceholder: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ReportForm = ({
  categories,
  submitLabel,
  descriptionPlaceholder,
  onSubmit,
  onCancel,
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

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 rounded-2xl bg-neutral-900 py-6 font-semibold text-white transition hover:bg-neutral-800"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl bg-neutral-200 py-6 font-semibold text-neutral-900 transition hover:bg-neutral-300"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
};
