import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'

// ────────────────────────────────────────────────────────────────────────────────
// IMPORTANT: set your Mapbox token in app.config.(js|ts) as extra.MAPBOX_TOKEN
// and add it to your .env. Then expose it via Constants.expoConfig?.extra?.MAPBOX_TOKEN
// ────────────────────────────────────────────────────────────────────────────────
MapboxGL.setAccessToken(
  (Constants.expoConfig?.extra as any)?.MAPBOX_TOKEN ||
    (Constants.manifest as any)?.extra?.MAPBOX_TOKEN
)
MapboxGL.setTelemetryEnabled(false)

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
export type NeighborhoodFeatureProps = {
  id: string
  name: string
  city: string
  explored: boolean
  // optional progress if you ever do partial completion (e.g., % of landmarks in that hood)
  completion?: number // 0..1
}

export type NeighborhoodFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  NeighborhoodFeatureProps
>

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────
const reverseGeocodeCity = async (
  lng: number,
  lat: number,
  token: string
): Promise<string | null> => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${token}`
    const res = await fetch(url)
    const data = await res.json()
    const city = data?.features?.[0]?.text || data?.features?.[0]?.place_name
    return city ?? null
  } catch (e) {
    return null
  }
}

// TODO: Replace this with a Supabase RPC or REST fetch that returns
// neighborhood polygons for a given city, including an `explored` flag.
const fetchNeighborhoodsGeoJSON = async (
  city: string
): Promise<GeoJSON.FeatureCollection> => {
  // Placeholder empty collection – integrate your real data here.
  return {
    type: 'FeatureCollection',
    features: [],
  } as GeoJSON.FeatureCollection
}

// ────────────────────────────────────────────────────────────────────────────────
// Explore Screen
// ────────────────────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const token =
    (Constants.expoConfig?.extra as any)?.MAPBOX_TOKEN ||
    (Constants.manifest as any)?.extra?.MAPBOX_TOKEN

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  )
  const [coords, setCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [city, setCity] = useState<string>('')
  const [hoods, setHoods] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [loading, setLoading] = useState(true)

  const cameraRef = useRef<MapboxGL.Camera>(null)

  // Ask for location + get user position
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setPermissionGranted(status === 'granted')
      if (status !== 'granted') return

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
    })()
  }, [])

  // Resolve city and neighborhoods when coords change
  useEffect(() => {
    ;(async () => {
      if (!coords || !token) return
      setLoading(true)
      const c = await reverseGeocodeCity(
        coords.longitude,
        coords.latitude,
        token
      )
      if (c) setCity(c)

      // Pull neighborhood polygons for this city (from Supabase or tileset)
      const geo = await fetchNeighborhoodsGeoJSON(c || '')
      setHoods(geo)
      setLoading(false)
    })()
  }, [coords, token])

  // Progress for current city: explored / total
  const progress = useMemo(() => {
    const feats = hoods.features as NeighborhoodFeature[]
    const total = feats.length || 0
    const explored = feats.filter(f => f.properties?.explored).length
    return { explored, total }
  }, [hoods])

  const onPressSearch = useCallback(() => {
    // TODO: open a modal / bottom sheet search
    console.log('open search')
  }, [])

  const center = useMemo(() => {
    if (coords) return [coords.longitude, coords.latitude] as [number, number]
    // Default to Irvine, CA (fallback)
    return [-117.8265, 33.6846] as [number, number]
  }, [coords])

  // ──────────────────────────────────────────────────────────────────────────────
  // Map layers for neighborhoods
  //   • Unexplored: light gray fill
  //   • Explored: subtle tint
  //   • Outline for all
  // NOTE: Styling expressions are evaluated by Mapbox on-device.
  // ──────────────────────────────────────────────────────────────────────────────
  const neighborhoodFillStyle: MapboxGL.FillLayerStyle = {
    fillColor: [
      'case',
      ['==', ['get', 'explored'], true],
      '#76c7ff', // explored tint (blue-ish)
      '#9aa0a6', // unexplored base (gray)
    ],
    fillOpacity: ['case', ['==', ['get', 'explored'], true], 0.25, 0.12],
  }

  const neighborhoodOutlineStyle: MapboxGL.LineLayerStyle = {
    lineColor: '#72767e',
    lineWidth: 1.25,
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Top HUD overlay */}
      <View style={styles.topBar} pointerEvents='box-none'>
        <Pressable style={styles.leftPill} onPress={() => {}}>
          <Text style={styles.leftPillText}>
            {progress.total > 0
              ? `${progress.explored}/${progress.total}`
              : '—'}
          </Text>
        </Pressable>

        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={styles.cityText}>
            {city || 'Locating…'}
          </Text>
        </View>

        <Pressable onPress={onPressSearch} style={styles.rightIcon} hitSlop={8}>
          <Ionicons name='search' size={22} color='#111827' />
        </Pressable>
      </View>

      {/* Fullscreen Map */}
      <View style={StyleSheet.absoluteFill}>
        <MapboxGL.MapView
          style={StyleSheet.absoluteFill}
          logoEnabled={false}
          compassEnabled
        >
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={center}
            animationDuration={800}
          />

          {/* User location puck */}
          <MapboxGL.UserLocation
            showsUserHeadingIndicator
            androidRenderMode='compass'
            minDisplacement={4}
          />

          {/* Neighborhood polygons */}
          {hoods.features.length > 0 && (
            <MapboxGL.ShapeSource id='neighborhoods' shape={hoods}>
              <MapboxGL.FillLayer
                id='hoods-fill'
                style={neighborhoodFillStyle}
              />
              <MapboxGL.LineLayer
                id='hoods-outline'
                style={neighborhoodOutlineStyle}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>

        {/* Loader while resolving city / neighborhoods */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Styles — mobile-first, minimal, clean
// ────────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    position: 'absolute',
    top: Platform.select({ ios: 58, android: 24, default: 24 }),
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  titleWrap: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    maxWidth: '70%',
  },
  leftPill: {
    position: 'absolute',
    left: 16,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  leftPillText: { fontWeight: '700', color: '#111827' },
  rightIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  loadingWrap: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
})

// ────────────────────────────────────────────────────────────────────────────────
// Integration Notes (read this once):
// 1) Install Mapbox for RN (Expo):
//    npm i @rnmapbox/maps && npx expo prebuild --clean --npm
//    (Expo managed supports via config plugin. If you can't prebuild yet,
//     code still compiles but map won't render on bare devices.)
// 2) iOS: add NSLocationWhenInUseUsageDescription in app.json (Expo does it).
// 3) Android: ensure location perms in AndroidManifest (config plugin handles).
// 4) Data model: store neighborhood polygons in Supabase (PostGIS recommended).
//    A) Table neighborhoods(id, name, city, explored boolean, geom geometry)
//    B) Create a PostgREST or RPC that returns GeoJSON FeatureCollection
//    C) Compute `explored` per-user (join against user_stamps) and alias it
// 5) Styling: unexplored are lightly gray; explored have a subtle tint.
// 6) Progress pill shows explored/total across current city.
// 7) Search icon: wire to a bottom sheet search; filter neighborhoods/landmarks.
// ────────────────────────────────────────────────────────────────────────────────
