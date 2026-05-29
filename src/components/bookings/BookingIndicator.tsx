import type { BookingIndicatorProps } from "../../types/booking";

export default function BookingIndicator({ total, currentIndex, onSelect }: BookingIndicatorProps) {
    return (
        <div className="flex items-center gap-1">
            <div className="text-sm font-medium">Mina bokningar:</div>

            <div className="booking-indicator flex items-center gap-2">
                {Array.from({ length: total }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(index)}
                        className={`px-2 py-1 rounded-full w-8 h-8 text-sm
                            ${index === currentIndex
                                ? "bg-green-500 hover:bg-green-700 text-white cursor-default"
                                : "bg-neutral-200 hover:bg-green-300 text-gray-700 cursor-pointer"}
                            `}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}