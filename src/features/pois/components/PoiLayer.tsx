// src/features/pois/components/PoiLayer.tsx
import React, { useMemo } from 'react'
import MapboxGL from '@rnmapbox/maps'
import type { Poi } from '../types'

type AnyPoi = Poi & {
  // allow either "coordinates" or lat/lon
  coordinates?: [number, number]
}

type Props = {
  pois?: AnyPoi[]
  selectedId?: string | null
  onSelect?: (p: AnyPoi | null) => void
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PIN = require('../../../assets/poi/marker.png')

const toLngLat = (p: AnyPoi): [number, number] => {
  if (Array.isArray(p.coordinates) && p.coordinates.length === 2) {
    return p.coordinates as [number, number] // [lng, lat]
  }
  // fallback to fields from Supabase
  return [Number(p.longitude), Number(p.latitude)]
}

const PoiLayer: React.FC<Props> = ({
  pois = [],
  selectedId = null,
  onSelect,
}) => {
  const fc = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: pois
        .filter(
          p =>
            p && (p.coordinates || (p.longitude != null && p.latitude != null))
        )
        .map(p => ({
          type: 'Feature' as const,
          id: String(p.id),
          geometry: { type: 'Point' as const, coordinates: toLngLat(p) },
          // Keep properties JSON-safe; avoid functions/objects like Date
          properties: {
            id: String(p.id),
            name: p.name,
            category: p.category ?? null,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
            image_url: p.image_url ?? null,
            isSelected: String(p.id) === String(selectedId),
          },
        })),
    }),
    [pois, selectedId]
  )

  const handlePress = (e: any) => {
    const props = e?.features?.[0]?.properties
    if (!props) return onSelect?.(null)
    // Rehydrate a POI-ish object from properties
    onSelect?.({
      id: props.id,
      name: props.name,
      category: props.category,
      latitude: Number(props.latitude),
      longitude: Number(props.longitude),
      image_url: props.image_url,
      coordinates: [Number(props.longitude), Number(props.latitude)],
    } as AnyPoi)
  }

  return (
    <>
      <MapboxGL.Images images={{ pin: PIN }} />
      <MapboxGL.ShapeSource id='pois-src' shape={fc} onPress={handlePress}>
        <MapboxGL.SymbolLayer
          id='pois-sym'
          style={{
            iconImage: 'pin',
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.2,
              13,
              0.5,
              19,
              1.0,
              20,
              2.0,
            ],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconAnchor: 'bottom',
            iconOffset: [0, -2],
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  )
}

export default PoiLayer
