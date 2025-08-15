// src/features/explore/screens/ExploreScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, Pressable, Text, Image, Linking, Platform } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { usePois } from '../../pois/hooks/usePois'
import type { Poi } from '../../pois/types'
import PoiLayer from '../../pois/components/PoiLayer'
import { distanceMeters, formatFeet } from '@/utils/haversine'
import { poiToGeo } from '@/utils/geo'

const STYLE_URL = 'mapbox://styles/dancarlton/cmeai6l5z005z01sn8l0h87et'
const FOLLOW_ZOOM = 17.5
const FOLLOW_PITCH = 65
const FLY_MS = 2200

export default function ExploreScreen() {
  const [hasPerm, setHasPerm] = useState<boolean | null>(null)
  const [here, setHere] = useState<{ lat: number; lon: number } | null>(null)
  const [firstFix, setFirstFix] = useState<[number, number] | null>(null) // [lng, lat]
  const [following, setFollowing] = useState(false)
  const [selected, setSelected] = useState<Poi | null>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)

  const { data: pois = [] } = usePois()

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setHasPerm(status === 'granted')
    })()
  }, [])

  useEffect(() => {
    if (firstFix && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: firstFix,
        zoomLevel: FOLLOW_ZOOM,
        pitch: FOLLOW_PITCH,
        animationMode: 'flyTo',
        animationDuration: FLY_MS,
      })
      const t = setTimeout(() => setFollowing(true), FLY_MS + 200)
      return () => clearTimeout(t)
    }
  }, [firstFix])

  const distanceText = useMemo(() => {
    if (!selected || !here) return '—'
    const d = distanceMeters(here, poiToGeo(selected))
    return Number.isFinite(d) ? formatFeet(d) : '—'
  }, [selected, here])

  const goToSelected = () => {
    if (!selected) return
    const { latitude, longitude, name } = selected
    const q = encodeURIComponent(name ?? 'Destination')
    const apple = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${q}`
    const google = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(Platform.select({ ios: apple, android: google, default: google })!)
  }

  // ⬇️ DO NOT return early — always render the root, then branch inside.
  return (
    <View style={styles.container}>
      {hasPerm ? (
        <>
          <MapboxGL.MapView
            style={StyleSheet.absoluteFill}
            styleURL={STYLE_URL}
            compassEnabled={false}
            scaleBarEnabled={false}
            logoEnabled={false}
            pitchEnabled
            rotateEnabled
            zoomEnabled
            attributionPosition={{ bottom: 12, right: 12 }}
            onCameraChanged={(e: any) => {
              const byGesture =
                e?.properties?.isUserInteraction ||
                e?.properties?.gesture ||
                e?.properties?.manual
              if (byGesture && following) setFollowing(false)

              const pitchNow = e?.properties?.pitch ?? 0
              if (following && pitchNow < FOLLOW_PITCH - 1 && cameraRef.current) {
                cameraRef.current.setCamera({ pitch: FOLLOW_PITCH, animationDuration: 0 })
              }
            }}
            onPress={() => setSelected(null)}
          >
            <MapboxGL.Camera
              ref={cameraRef}
              defaultSettings={{ centerCoordinate: [0, 0], zoomLevel: 0, pitch: 0 }}
              followUserLocation={following}
              followUserMode="course"
              followZoomLevel={FOLLOW_ZOOM}
              followPitch={FOLLOW_PITCH}
              padding={{ top: 20, bottom: 120, left: 0, right: 0 }}
            />

            <MapboxGL.UserLocation
              visible
              puckBearingEnabled
              puckBearing="heading"
              onUpdate={(pos) => {
                const lat = pos.coords.latitude
                const lon = pos.coords.longitude
                setHere({ lat, lon })
                if (!firstFix) setFirstFix([lon, lat])
              }}
            />

            <PoiLayer
              pois={pois}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
            />
          </MapboxGL.MapView>

          {firstFix && !following && (
            <Pressable style={styles.fab} onPress={() => setFollowing(true)}>
              <Text style={styles.fabLabel}>Recenter</Text>
            </Pressable>
          )}

          {selected && (
            <View style={styles.sheet} pointerEvents="box-none">
              <View style={styles.card}>
                <Image
                  source={
                    selected.image_url
                      ? { uri: selected.image_url }
                      : require('@/assets/placeholder.jpg')
                  }
                  style={styles.hero}
                  resizeMode="cover"
                />
                <View style={styles.body}>
                  <View style={styles.row}>
                    <Text style={styles.title} numberOfLines={1}>
                      {selected.name}
                    </Text>
                    <Text style={styles.distance}>{distanceText}</Text>
                  </View>
                  <Pressable style={styles.goBtn} onPress={goToSelected}>
                    <Text style={styles.goLabel}>Go</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </>
      ) : (
        // Permission pending/denied placeholder (keeps hooks order stable)
        <View style={styles.center}>
          <Text style={styles.centerText}>
            {hasPerm === null ? 'Requesting location permission…' : 'Location permission denied'}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerText: { color: '#fff', opacity: 0.7 },

  sheet: { position: 'absolute', left: 12, right: 12, bottom: 16 },
  card: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#111' },
  hero: { height: 150, width: '100%', backgroundColor: '#222' },

  body: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#111' },
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', flexShrink: 1, paddingRight: 8 },
  distance: { color: '#cbd5e1', fontSize: 14, fontWeight: '700' },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  fabLabel: { color: '#fff', fontWeight: '600' },

  goBtn: { backgroundColor: '#3b82f6', borderRadius: 14, alignItems: 'center', justifyContent: 'center', height: 48 },
  goLabel: { color: '#fff', fontWeight: '800', fontSize: 18 },
})
