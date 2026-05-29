import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LeafletMapProps } from '../../types/map'

export default function LeafletMap({
    location,
    zoom = 16,
    className = '',
    minHeightClassName = 'min-h-72',
    scrollWheelZoom = false,
    showMarker = true,
    markerRadius = 8,
    markerColor = '#111827',
    markerFillColor = '#9ca3af',
    tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!mapContainerRef.current) return

        const map = L.map(mapContainerRef.current, {
            zoomControl: true,
            scrollWheelZoom,
        }).setView([location.latitude, location.longitude], zoom)

        L.tileLayer(tileUrl, {
            attribution: tileAttribution,
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map)

        if (showMarker) {
            L.circleMarker([location.latitude, location.longitude], {
                radius: markerRadius,
                color: markerColor,
                weight: 2,
                fillColor: markerFillColor,
                fillOpacity: 1,
            }).addTo(map)
        }

        return () => {
            map.remove()
        }
    }, [
        location.latitude,
        location.longitude,
        markerColor,
        markerFillColor,
        markerRadius,
        scrollWheelZoom,
        showMarker,
        tileAttribution,
        tileUrl,
        zoom,
    ])

    return <div ref={mapContainerRef} className={`${minHeightClassName} w-full ${className}`.trim()} />
}