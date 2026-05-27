export type MapLocation = {
    latitude: number
    longitude: number
}

export type LeafletMapProps = {
    location: MapLocation
    zoom?: number
    className?: string
    minHeightClassName?: string
    scrollWheelZoom?: boolean
    showMarker?: boolean
    markerRadius?: number
    markerColor?: string
    markerFillColor?: string
    tileUrl?: string
    tileAttribution?: string
}