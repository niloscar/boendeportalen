import { useEffect, useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CaretDownIcon } from '@phosphor-icons/react'

type DropDownItem = {
    to: string
    title: string
}

type DropDownProps = {
    items: DropDownItem[]
    fallbackTitle?: string
    ariaLabel?: string
}

export default function DropDown({
    items,
    fallbackTitle = 'Meny',
    ariaLabel = 'Dropdown-meny'
}: DropDownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef<HTMLElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const location = useLocation()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!navRef.current) return
            if (!navRef.current.contains(event.target as Node)) setIsOpen(false); {/* Close dropdown if click is outside the nav */}
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

    const activeItem = items.find((item) => (
        location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
    ))

    const activeItemTitle = activeItem?.title ?? fallbackTitle

    return (
        <nav
            ref={navRef}
            aria-label={ariaLabel}
            className={`
                relative w-full md:w-max bg-neutral-100 text-sm
                ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}
            `}
        >
            <button
                type='button'
                ref={buttonRef}
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup='true'
                className='w-full flex items-center justify-between gap-1 py-2 px-4 cursor-pointer'
            >
                <span className='whitespace-nowrap'>{activeItemTitle}</span>
                <CaretDownIcon size={16} className='shrink-0' />
            </button>

            {/* Invisible ul to get the container width to adapt to the content */}
            <ul
                aria-hidden='true'
                className='invisible h-0 overflow-hidden flex flex-col gap-1 px-4'
            >
                {items.map((item) => (
                    <li key={item.to}>
                        <span className='flex items-center justify-between gap-1 whitespace-nowrap'>
                            <span>{item.title}</span>
                            <span className='w-4 shrink-0' /> {/* Placeholder for the icon to keep spacing consistent */}
                        </span>
                    </li>
                ))}
            </ul>

            <ul
                className={`
                    ${isOpen ? 'flex' : 'hidden'}
                    absolute top-full left-0 z-10 w-full
                    flex-col gap-1 py-2 px-4
                    bg-neutral-100 rounded-b-2xl
                `}
            >
                {items.map((item) => (
                    <li key={item.to} className='w-full'>
                        <NavLink
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => [
                                'block w-full whitespace-nowrap text-neutral-700 cursor-pointer no-underline hover:underline',
                                isActive && 'text-neutral-950'
                            ].filter(Boolean).join(' ')}
                        >
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
