// app/(tabs)/explore.tsx
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as Location from 'expo-location'

const STYLE_URL = 'mapbox://styles/dancarlton/cmeai6l5z005z01sn8l0h87et'

export default function ExploreScreen() {
  const [hasPerm, setHasPerm] = useState<boolean | null>(null)
  const [hasFix, setHasFix] = useState(false)
  const [following, setFollowing] = useState(false) // start false; enable after first fix
  const [lastCoord, setLastCoord] = useState<[number, number] | null>(null) // [lng, lat]

  const FOLLOW_ZOOM = 17.5
  const FOLLOW_PITCH = 65

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setHasPerm(status === 'granted')
    })()
  }, [])

  // when we get the first fix, flip both flags once
  useEffect(() => {
    if (hasFix && !following) setFollowing(true)
  }, [hasFix, following])

  if (hasPerm === null) return null

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
        // Any touch on the map = user interaction → stop following
        onTouchStart={() => following && setFollowing(false)}
        // Keep a copy of where the camera is, for non-follow view
        onCameraChanged={(e: any) => {
          const cc = e?.properties?.centerCoordinate
          if (Array.isArray(cc) && cc.length === 2) setLastCoord([cc[0], cc[1]])
        }}
      >
        {/* Only mount a camera once we have a GPS fix, to avoid the initial world→jump */}
        {hasFix && (following ? (
          <MapboxGL.Camera
            followUserLocation
            followUserMode="course"           // rotate with movement direction
            followZoomLevel={FOLLOW_ZOOM}
            followPitch={FOLLOW_PITCH}
            animationMode="flyTo"
            animationDuration={600}
          />
        ) : (
          lastCoord && (
            <MapboxGL.Camera
              centerCoordinate={lastCoord}
              zoomLevel={FOLLOW_ZOOM}
              pitch={FOLLOW_PITCH}
              animationMode="easeTo"
              animationDuration={300}
            />
          )
        ))}

        {/* New puck API: bearing follows heading, no deprecated props */}
        <MapboxGL.LocationPuck
          type="puck2D"
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: false }}
        />

        {/* Update our last known coord + mark that we have a fix */}
        <MapboxGL.UserLocation
          visible
          renderMode="native"
          onUpdate={(pos) => {
            const { longitude, latitude } = pos.coords
            setLastCoord([longitude, latitude])
            if (!hasFix) setHasFix(true)
          }}
        />
      </MapboxGL.MapView>

      {/* Recenter button when user has panned/zoomed away */}
      {hasFix && !following && (
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
