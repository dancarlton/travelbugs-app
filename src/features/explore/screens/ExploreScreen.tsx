// app/(tabs)/explore.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';

// POIs feature
import { PoiLayer, POIS, useSelectedPoi } from '@/features/pois';

const STYLE_URL = 'mapbox://styles/dancarlton/cmeai6l5z005z01sn8l0h87et';
const FOLLOW_ZOOM = 17.5;
const FOLLOW_PITCH = 65;
const FLY_MS = 2200;

export default function ExploreScreen() {
  const [hasPerm, setHasPerm] = useState<boolean | null>(null);
  const [firstFix, setFirstFix] = useState<[number, number] | null>(null);
  const [following, setFollowing] = useState(false);
  const [lastCoord, setLastCoord] = useState<[number, number] | null>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const { selected, select } = useSelectedPoi();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPerm(status === 'granted');
    })();
  }, []);

  // Fly from globe → first GPS fix, then begin following
  useEffect(() => {
    if (firstFix && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: firstFix,
        zoomLevel: FOLLOW_ZOOM,
        pitch: FOLLOW_PITCH,
        animationMode: 'flyTo',
        animationDuration: FLY_MS,
      });
      const t = setTimeout(() => setFollowing(true), FLY_MS + 200);
      return () => clearTimeout(t);
    }
  }, [firstFix]);

  if (hasPerm === null) return null;

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
            e?.properties?.manual;
          if (byGesture && following) setFollowing(false);

          // keep the view pitched while following
          const pitchNow = e?.properties?.pitch ?? 0;
          if (following && pitchNow < FOLLOW_PITCH - 1 && cameraRef.current) {
            cameraRef.current.setCamera({ pitch: FOLLOW_PITCH, animationDuration: 0 });
          }
        }}
        onPress={(event) => {
          const coords = event.geometry.coordinates; // [lng, lat]
          console.log('📍 Tap coords (lng, lat):', coords);
        }}
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
            const coord: [number, number] = [pos.coords.longitude, pos.coords.latitude];
            setLastCoord(coord);
            if (!firstFix) setFirstFix(coord);
          }}
        />

        {/* ONE PoiLayer only */}
        <PoiLayer
          pois={POIS}
          selectedId={selected?.id ?? null}
          onSelect={select}
        />
      </MapboxGL.MapView>

      {selected && (
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{selected.name}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable style={styles.ctaSecondary} onPress={() => select(null)}>
              <Text style={styles.ctaSecondaryLabel}>Close</Text>
            </Pressable>
            <Pressable
              style={styles.ctaPrimary}
              onPress={() => {
                // TODO: navigate to quest flow/details
                console.log('Start quest for', selected.id);
              }}
            >
              <Text style={styles.ctaPrimaryLabel}>Start quest</Text>
            </Pressable>
          </View>
        </View>
      )}

      {firstFix && !following && (
        <Pressable style={styles.fab} onPress={() => setFollowing(true)}>
          <Text style={styles.fabLabel}>Recenter</Text>
        </Pressable>
      )}
    </View>
  );
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
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(20,20,20,0.95)',
  },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  ctaPrimary: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ctaPrimaryLabel: { color: '#fff', fontWeight: '700' },
  ctaSecondary: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ctaSecondaryLabel: { color: '#fff', fontWeight: '600' },
});
