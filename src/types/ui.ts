import type { ReactElement } from "react";

export type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor: "primary" | "red";
};

export type AlertDialogProps = {
    open: boolean;
    title?: string | ReactElement;
    message?: React.ReactNode;
    onConfirm: () => void;
    confirmColor: "primary" | "red";
};

export type FormSwitchProps = {
    id: string
    name: string
    checked: boolean
    onSwitchChange: (name: string, checked: boolean) => void
    disabled?: boolean
};

export type FilterBoxDropdownOption = {
    label: string
    value: string
    checked: boolean
    onToggle: () => void
}

export type FilterBoxField = {
    kind: 'search'
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    ariaLabel?: string
    className?: string
} | {
    kind: 'dropdown'
    label: string
    summary: string
    options: FilterBoxDropdownOption[]
    onClear?: () => void
    className?: string
} | {
    kind: 'select'
    label: string
    value: string
    onChange: (value: string) => void
    options: Array<{ label: string; value: string }>
    ariaLabel?: string
    className?: string
} | {
    kind: 'range'
    label: string
    value: number
    min: number
    max: number
    onChange: (value: number) => void
    valueLabel?: string
    className?: string
}

export type FilterBoxProps = {
    fields: FilterBoxField[]
    footer?: ReactNode
    className?: string
    gridClassName?: string
    footerClassName?: string
    open?: boolean
    triggerLabel?: string
    onTrigger?: () => void
    triggerClassName?: string
}