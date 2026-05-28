import type { LeafletMapProps } from "../../types/map"

export const lightGrayMapPreset: Pick<LeafletMapProps, 'zoom' | 'className' | 'minHeightClassName' | 'scrollWheelZoom' | 'markerRadius' | 'markerColor' | 'markerFillColor'> = {
    zoom: 16,
    className: 'h-full',
    minHeightClassName: 'h-full min-h-0',
    scrollWheelZoom: false,
    markerRadius: 8,
    markerColor: '#111827',
    markerFillColor: '#9ca3af',
}

export const compactGrayMapPreset: Pick<LeafletMapProps, 'zoom' | 'scrollWheelZoom' | 'markerRadius' | 'markerColor' | 'markerFillColor'> = {
    zoom: 14,
    scrollWheelZoom: false,
    markerRadius: 7,
    markerColor: '#111827',
    markerFillColor: '#b0b7c3',
}