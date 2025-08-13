import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

<<<<<<< HEAD
// ────────────────────────────────────────────────────────────────────────────────
// Mapbox setup
// ────────────────────────────────────────────────────────────────────────────────
MapboxGL.setAccessToken(
  (Constants.expoConfig?.extra as any)?.MAPBOX_TOKEN ||
    (Constants.manifest as any)?.extra?.MAPBOX_TOKEN
)
MapboxGL.setTelemetryEnabled(false)

// Types
export type NeighborhoodFeatureProps = {
  id: string
  name: string
  city: string
  explored: boolean
  completion?: number
}
export type NeighborhoodFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  NeighborhoodFeatureProps
>

// Helpers
const reverseGeocodeCity = async (lng: number, lat: number, token: string) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${token}`
    const res = await fetch(url)
    const data = await res.json()
    const city = data?.features?.[0]?.text || data?.features?.[0]?.place_name
    return (city as string) ?? null
  } catch {
    return null
  }
}

// Placeholder — replace with Supabase fetch
const fetchNeighborhoodsGeoJSON = async (
  _city: string
): Promise<GeoJSON.FeatureCollection> => ({
  type: 'FeatureCollection',
  features: [],
})

// Layer styles
const neighborhoodFillStyle: MapboxGL.FillLayerStyle = {
  fillColor: ['case', ['==', ['get', 'explored'], true], '#76c7ff', '#9aa0a6'],
  fillOpacity: ['case', ['==', ['get', 'explored'], true], 0.25, 0.12],
}
const neighborhoodOutlineStyle: MapboxGL.LineLayerStyle = {
  lineColor: '#72767e',
  lineWidth: 1.25,
}

// ────────────────────────────────────────────────────────────────────────────────
// Screen
// ────────────────────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const token =
    (Constants.expoConfig?.extra as any)?.MAPBOX_TOKEN ||
    (Constants.manifest as any)?.extra?.MAPBOX_TOKEN

  // Use your Studio style here (must be published & token allowed for bundle id)
  const styleURL: string =
    (Constants.expoConfig?.extra as any)?.MAPBOX_STYLE_URL ||
    (Constants.manifest as any)?.extra?.MAPBOX_STYLE_URL ||
    MapboxGL.StyleURL.Street

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
      const geo = await fetchNeighborhoodsGeoJSON(c || '')
      setHoods(geo)
      setLoading(false)
    })()
  }, [coords, token])

  const progress = useMemo(() => {
    const feats = hoods.features as NeighborhoodFeature[]
    const total = feats.length || 0
    const explored = feats.filter(f => f.properties?.explored).length
    return { explored, total }
  }, [hoods])

  const onPressSearch = useCallback(() => {}, [])

  const center = useMemo<[number, number]>(() => {
    if (coords) return [coords.longitude, coords.latitude]
    return [-117.8265, 33.6846] // Irvine fallback
  }, [coords])

  const EMPTY_FC: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  return (
    <View style={styles.container}>
      {/* HUD */}
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

      {/* Map */}
      <MapboxGL.MapView
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false}
        compassEnabled
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={center}
          animationDuration={800}
        />
        <MapboxGL.UserLocation
          showsUserHeadingIndicator
          androidRenderMode='compass'
          minDisplacement={4}
        />
      </MapboxGL.MapView>
      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      )}
=======
export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text>Explore (placeholder)</Text>
>>>>>>> 78df592 (Set up Mapbox token via app.config.ts and env, clean Explore placeholder)
    </View>
  )
}

<<<<<<< HEAD
// ────────────────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 }, // simpler than absoluteFill—prevents 0x0 size issues
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
=======
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
>>>>>>> 78df592 (Set up Mapbox token via app.config.ts and env, clean Explore placeholder)
})
