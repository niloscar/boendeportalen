import { useEffect, useRef, useState } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'

export type SelectDropDownItem<TValue extends string> = {
    value: TValue
    title: string
}

type SelectDropDownProps<TValue extends string> = {
    items: SelectDropDownItem<TValue>[]
    value: TValue | null
    onChange: (value: TValue) => void
    fallbackTitle?: string
    ariaLabel?: string
}

export default function SelectDropDown<TValue extends string>({
    items,
    value,
    onChange,
    fallbackTitle = 'Välj',
    ariaLabel = 'Välj alternativ'
}: SelectDropDownProps<TValue>) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current) return

            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape' || !isOpen) return

            setIsOpen(false)
            buttonRef.current?.focus()
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    function handleToggle() {
        setIsOpen((current) => !current)
    }

    function handleSelect(selectedValue: TValue) {
        onChange(selectedValue)
        setIsOpen(false)
        buttonRef.current?.focus()
    }

    const activeItem = items.find((item) => item.value === value)
    const activeItemTitle = activeItem?.title ?? fallbackTitle

    return (
        <div
            ref={containerRef}
            className={`
                relative w-full md:w-max bg-neutral-900 text-white text-sm border border-neutral-200
                ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}
            `}
        >
            <button
                type="button"
                ref={buttonRef}
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className="w-full flex items-center justify-between gap-1 py-2.5 px-5 cursor-pointer"
            >
                <span className="whitespace-nowrap">{activeItemTitle}</span>
                <CaretDownIcon size={16} className="shrink-0" />
            </button>

            {/* Invisible ul to get the container width to adapt to the content */}
            <ul
                aria-hidden="true"
                className="invisible h-0 overflow-hidden flex flex-col gap-1 px-5"
            >
                {items.map((item) => (
                    <li key={item.value}>
                        <span className="flex items-center justify-between gap-1 whitespace-nowrap">
                            <span>{item.title}</span>
                            <span className="w-4 shrink-0" />
                        </span>
                    </li>
                ))}
            </ul>

            <ul
                role="listbox"
                aria-label={ariaLabel}
                className={`
                    ${isOpen ? 'flex' : 'hidden'}
                    absolute top-full left-0 z-10 w-full
                    flex-col gap-1 py-2.5 px-5
                    bg-neutral-900 rounded-b-2xl
                `}
            >
                {items.map((item) => (
                    <li key={item.value} className="w-full">
                        <button
                            type="button"
                            role="option"
                            aria-selected={item.value === value}
                            onClick={() => handleSelect(item.value)}
                            className="block w-full whitespace-nowrap text-left text-neutral-100 cursor-pointer no-underline hover:underline py-0.5"
                        >
                            {item.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}