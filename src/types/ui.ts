export type Crumb = {
    title: string
    href?: string
}

export type BreadcrumbsProps = {
    crumbs: Crumb[]
}

export type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor: "green" | "red";
};

export type AlertDialogProps = {
    open: boolean;
    title?: string;
    message?: React.ReactNode;
    onConfirm: () => void;
    confirmColor: "green" | "red";
};

export type FormSwitchProps = {
    id: string
    name: string
    checked: boolean
    onSwitchChange: (name: string, checked: boolean) => void
    disabled?: boolean
};