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
    message?: string;
    onConfirm: () => void;
    confirmColor: "green" | "red";
};