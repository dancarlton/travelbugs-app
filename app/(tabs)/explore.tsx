// app/(tabs)/explore.tsx
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'

const STYLE_URL = 'mapbox://styles/dancarlton/cmeai6l5z005z01sn8l0h87et'
const FOLLOW_ZOOM = 17.5
const FOLLOW_PITCH = 65
const FLYOVER_DURATION = 2500 // ms

export default function ExploreScreen() {
  const [hasPerm, setHasPerm] = useState<boolean | null>(null)
  const [firstFix, setFirstFix] = useState<[number, number] | null>(null)
  const [following, setFollowing] = useState(false) // start NOT following
  const [lastCoord, setLastCoord] = useState<[number, number] | null>(null)

  const cameraRef = useRef<MapboxGL.Camera>(null)

  // Request location permissions
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setHasPerm(status === 'granted')
    })()
  }, [])

  // When we get first GPS fix, fly to it and then start following
  useEffect(() => {
    if (firstFix && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: firstFix,
        zoomLevel: FOLLOW_ZOOM,
        pitch: FOLLOW_PITCH,
        animationMode: 'flyTo',
        animationDuration: FLYOVER_DURATION,
      })

      // enable follow slightly after the flyTo completes
      const t = setTimeout(() => setFollowing(true), FLYOVER_DURATION + 100)
      return () => clearTimeout(t)
    }
  }, [firstFix])

  if (hasPerm === null) return null // still deciding on permissions

  return (
    <View style={styles.container}>
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

          // keep the view pitched while following
          const pitchNow = e?.properties?.pitch ?? 0
          if (following && pitchNow < FOLLOW_PITCH - 1 && cameraRef.current) {
            cameraRef.current.setCamera({
              pitch: FOLLOW_PITCH,
              animationDuration: 0,
            })
          }
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [0, 0],
            zoomLevel: 0,
            pitch: 0,
          }}
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
            const coord: [number, number] = [
              pos.coords.longitude,
              pos.coords.latitude,
            ]
            setLastCoord(coord)
            if (!firstFix) setFirstFix(coord)
          }}
        />
      </MapboxGL.MapView>

      {firstFix && !following && (
        <Pressable style={styles.fab} onPress={() => setFollowing(true)}>
          <Text style={styles.fabLabel}>Recenter</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
})
