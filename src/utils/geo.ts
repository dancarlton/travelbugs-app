// src/utils/geo.ts
import type { Poi } from '@/features/pois/types'

// Canonical app shape for math
export type GeoPoint = { lat: number; lon: number }
// Mapbox shape
export type LngLat = [number, number] // [longitude, latitude]

export const poiToGeo = (p: Poi): GeoPoint => ({
  lat: p.latitude,
  lon: p.longitude,
})

export const poiToLngLat = (p: Poi): LngLat => [p.longitude, p.latitude]
export const geoToLngLat = (g: GeoPoint): LngLat => [g.lon, g.lat]
