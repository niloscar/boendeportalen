export type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor: "green" | "red";
};