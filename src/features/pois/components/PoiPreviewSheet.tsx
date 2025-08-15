// src/features/pois/components/PoiPreviewSheet.tsx
import React, { useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export type PoiPreview = {
  id: string
  name: string
  lat: number
  lng: number
  imageUrl?: string
  neighborhood?: string
  category?: string
  distanceMeters?: number // optional precomputed
}

type Props = {
  poi: PoiPreview | null
  onClose: () => void
  onGo: (poi: PoiPreview) => void
  onDetails: (poi: PoiPreview) => void
  onSave?: (poi: PoiPreview) => void
}

const SHEET_PCT = 0.25 // quarter screen peek

export default function PoiPreviewSheet({
  poi,
  onClose,
  onGo,
  onDetails,
  onSave,
}: Props) {
  const open = !!poi
  const translateY = useRef(new Animated.Value(1)).current // 1=hidden, 0=visible

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: open ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start()
  }, [open, translateY])

  const distanceText = useMemo(() => {
    if (!poi?.distanceMeters && poi?.distanceMeters !== 0) return ''
    const m = poi.distanceMeters!
    if (m < 950) return `${Math.round(m)} m`
    const mi = m / 1609.344
    return `${mi.toFixed(mi < 10 ? 1 : 0)} mi`
  }, [poi])

  // hidden overlay to dismiss by tapping outside
  return (
    <>
      <Pressable
        pointerEvents={open ? 'auto' : 'none'}
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
      </Pressable>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          {
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000], // slide off-screen
                }),
              },
            ],
          },
        ]}
      >
        {!!poi && (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image
                source={
                  poi.imageUrl
                    ? { uri: poi.imageUrl }
                    : require('../../../../assets/placeholder-4x3.png')
                }
                style={styles.thumb}
              />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.title}>
                  {poi.name}
                </Text>
                <View style={styles.metaRow}>
                  {poi.neighborhood ? (
                    <Text style={styles.chip}>{poi.neighborhood}</Text>
                  ) : null}
                  {poi.category ? (
                    <Text style={styles.chip}>{poi.category}</Text>
                  ) : null}
                  {distanceText ? (
                    <Text style={styles.distance}>{distanceText}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => onDetails(poi)}
                style={[styles.btn, styles.btnGhost]}
              >
                <Text style={styles.btnGhostLabel}>Details</Text>
              </Pressable>
              {onSave ? (
                <Pressable
                  onPress={() => onSave?.(poi)}
                  style={[styles.btn, styles.btnGhost]}
                >
                  <Text style={styles.btnGhostLabel}>Save</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={() => onGo(poi)} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnPrimaryLabel}>Go</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(20,20,20,0.97)',
    gap: 12,
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: {
    width: 96,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#111',
  },
  title: { color: '#fff', fontWeight: '700', fontSize: 16 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: {
    color: '#cbd5e1',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
  },
  distance: { color: '#93c5fd', fontSize: 12, marginLeft: 'auto' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 2, justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.1)' },
  btnGhostLabel: { color: '#e5e7eb', fontWeight: '600' },
  btnPrimary: { backgroundColor: '#3b82f6' },
  btnPrimaryLabel: { color: '#fff', fontWeight: '700' },
})
