// src/features/pois/components/PoiLayer.tsx
import React, { useMemo } from 'react'
import MapboxGL from '@rnmapbox/maps'
import type { Poi } from '../types'

type Props = {
  pois?: Poi[]
  selectedId?: string | null
  onSelect?: (p: Poi | null) => void
}

// keep this path EXACTLY where your png lives: /assets/poi/poi-pin.png
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PIN = require('../../../assets/poi/marker.png')

const PoiLayer: React.FC<Props> = ({
  pois = [],
  selectedId = null,
  onSelect,
}) => {
  const fc = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: pois.map(p => ({
        type: 'Feature' as const,
        id: p.id,
        geometry: { type: 'Point' as const, coordinates: p.coordinates },
        properties: { ...p, isSelected: p.id === selectedId },
      })),
    }),
    [pois, selectedId]
  )

  const handlePress = (e: any) => {
    const poi = e?.features?.[0]?.properties as Poi | undefined
    onSelect?.(poi ?? null)
  }

  return (
    <>
      {/* Register the bitmap once */}
      <MapboxGL.Images images={{ pin: PIN }} />

      {/* Unique, stable ids to avoid “existing source” warnings */}
      <MapboxGL.ShapeSource id='pois-src' shape={fc} onPress={handlePress}>
        <MapboxGL.SymbolLayer
          id='pois-sym'
          style={{
            iconImage: 'pin',
            // Bigger when selected, smaller otherwise
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.2, // zoom level 0 → tiny
              13,
              0.5, // mid zoom
              19,
              1.0, // close up
              20,
              2.0, // max zoom → double size
            ],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  )
}

export default PoiLayer
