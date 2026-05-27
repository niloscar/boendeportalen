import { CaretDownIcon } from '@phosphor-icons/react'
import type { FilterBoxField, FilterBoxProps } from '../../types/ui'
import Button from './Button'

function renderField(field: FilterBoxField) {
    if (field.kind === 'search') {
        return (
            <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral-600">{field.label}</span>
                <input
                    type="text"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={field.ariaLabel ?? field.label}
                />
            </label>
        )
    }

    if (field.kind === 'select') {
        return (
            <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral-600">{field.label}</span>
                <div className="relative">
                    <select
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        className="w-full appearance-none overflow-hidden whitespace-nowrap text-ellipsis px-3 py-2 pr-10 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                        aria-label={field.ariaLabel ?? field.label}
                    >
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <CaretDownIcon
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-neutral-500"
                        aria-hidden="true"
                    />
                </div>
            </label>
        )
    }

    if (field.kind === 'range') {
        return (
            <div className="flex flex-col gap-1 self-start">
                <label className="text-sm text-neutral-600">{field.label}</label>
                <div className="flex items-start gap-2 pt-3">
                    <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                        className="w-full accent-green-600 justify-self-center items-center cursor-pointer"
                    />
                    <span className="min-w-14 text-right text-sm text-neutral-700">{field.valueLabel ?? field.value}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center">
                <span className="text-sm text-neutral-600">{field.label}</span>
            </div>

            <details className="group relative">
                <summary className="group list-none w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between">
                    <span className="min-w-0 flex-1 truncate text-neutral-800">{field.summary}</span>
                    <CaretDownIcon size={16} className="shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-lg border border-neutral-300 bg-white shadow-md p-2">
                    {field.onClear ? (<button type="button" onClick={field.onClear} className="text-xs text-neutral-600 underline hover:text-neutral-900 cursor-pointer">Rensa</button>) : null}
                    {field.options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 cursor-pointer">
                            <input type="checkbox" checked={option.checked} onChange={option.onToggle} />
                            <span className="text-sm text-neutral-800">{option.label}</span>
                        </label>
                    ))}
                </div>
            </details>
        </div>
    )
}

export default function FilterBox({
    fields,
    className = '',
    footer,
    gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3',
    footerClassName = '',
    open,
    triggerLabel,
    onTrigger,
    triggerClassName = '',
}: FilterBoxProps) {
    const classes = ['w-full bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-md', className].filter(Boolean).join(' ')
    const footerClasses = ['mt-3 flex justify-end', footerClassName].filter(Boolean).join(' ')
    const content = (
        <>
            <div className={gridClassName}>
                {fields.map((field) => (
                    <div key={`${field.kind}-${field.label}`} className={field.className}>
                        {renderField(field)}
                    </div>
                ))}
            </div>

            {footer ? <div className={footerClasses}>{footer}</div> : null}
        </>
    )

    return (
        <section className={classes}>
            {triggerLabel && onTrigger ? (
                <div className="mb-3 flex justify-start">
                    <Button type="button" variant="primary" size="md" onClick={onTrigger} className={triggerClassName}>
                        {triggerLabel}
                    </Button>
                </div>
            ) : null}

            {open === false ? null : content}
        </section>
    )
}