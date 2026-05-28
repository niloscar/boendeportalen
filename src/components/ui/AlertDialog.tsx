import { useEffect } from "react";
import type { AlertDialogProps } from "../../types/ui";

export default function AlertDialog({
    open,
    title,
    message,
    onConfirm,
    confirmColor
}: AlertDialogProps) {

    const colorMap = {
        primary: "bg-neutral-900 hover:bg-neutral-800",
        red: "bg-red-500 hover:bg-red-700"
    };

    // Close dialog with escape key
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onConfirm();
        }
        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onConfirm]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onConfirm}
            />

            {/* Dialog */}

            <div className="p-6 relative bg-white rounded-2xl shadow-md w-full max-w-[600px] max-h-[80vh] flex flex-col animate-[fadeIn_0.15s_ease-out]">

                {/* Scrollbart innehåll */}
                <div className="p-2 overflow-y-auto flex-1">
                    <h2 className="text-xl text-neutral-900 font-semibold mb-2">{title}</h2>
                    <p className="whitespace-pre-line text-gray-700">{message}</p>
                </div>

                {/* Fast footer */}
                <div className="pt-6 rounded-b-2xl flex justify-end bg-white">
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 text-sm rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-white ${colorMap[confirmColor]}`}>
                        OK
                    </button>
                </div>
            </div>            
        </div>);
}