import { useEffect } from "react";
import type { ConfirmDialogProps } from "../../types/ui";

export default function ConfirmDialog({
    open,
    title = "Är du säker?",
    message = "Vill du verkligen fortsätta?",
    isProcessing,
    onConfirm,
    onCancel,
    confirmColor
}: ConfirmDialogProps) {

    const colorMap = {
        primary: "bg-neutral-900 hover:bg-neutral-800",
        red: "bg-red-500 hover:bg-red-700"
    };

    // Close dialog with escape key
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onCancel();
        }
        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-md p-6 w-full max-w-sm animate-[fadeIn_0.15s_ease-out]">
                <h2 className="text-xl text-neutral-900 font-semibold mb-2">{title}</h2>
                <p className="whitespace-pre-line text-gray-700 pt-2 pb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-gray-700 border border-neutral-300 hover:bg-neutral-100">
                        Avbryt
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`px-5 py-2.5 text-sm rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-white ${colorMap[confirmColor]}`}>
                        {isProcessing ? "..." : "OK"}
                    </button>
                </div>
            </div>
        </div >
    );
}