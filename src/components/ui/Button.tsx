import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: 'md' | 'lg';
    children: ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    type = 'button',
    className = '',
    children,
    ...rest
}: ButtonProps) => {
    const base =
        'rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer';
    const variants: Record<Variant, string> = {
        primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
        secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
    };
    const sizes: Record<string, string> = {
        md: 'p-6 text-sm',
        lg: 'p-8 text-base',
    };

    const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');

    return (
        <button className={classes} type={type} {...rest}>
            {children}
        </button>
    );
};

export default Button;
