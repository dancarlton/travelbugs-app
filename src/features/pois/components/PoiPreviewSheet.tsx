import React, { useEffect, useMemo, useRef } from 'react'
import { View, Image, Text, Pressable, StyleSheet } from 'react-native'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { PoiPreview } from '../types'

type Props = {
  poi: PoiPreview | null
  onClose: () => void
  onGo: (poi: PoiPreview) => void
  onDetails: (poi: PoiPreview) => void
  onSave?: (poi: PoiPreview) => void
}

export default function PoiPreviewSheet({
  poi,
  onClose,
  onGo,
  onDetails,
  onSave,
}: Props) {
  const ref = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['22%', '48%', '88%'], [])

  useEffect(() => {
    if (poi) {
      ref.current?.present()
    } else {
      ref.current?.dismiss()
    }
  }, [poi?.id])

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={p => (
        <BottomSheetBackdrop
          {...p}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior='close'
        />
      )}
      handleIndicatorStyle={{ backgroundColor: '#cbd5e1' }}
      backgroundStyle={{ backgroundColor: '#1e293b' }}
    >
      {!poi ? null : (
        <View style={styles.content}>
          <View style={styles.row}>
            <Image
              source={
                poi.imageUrl
                  ? { uri: poi.imageUrl }
                  : require('../../../assets/placeholder.jpg')
              }
              style={styles.thumb}
            />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>
                {poi.name}
              </Text>
              <View style={styles.metaRow}>
                {poi.neighborhood && (
                  <Text style={styles.chip}>{poi.neighborhood}</Text>
                )}
                {poi.category && (
                  <Text style={styles.chip}>{poi.category}</Text>
                )}
                {Number.isFinite(poi.distanceMeters) && (
                  <Text style={styles.chip}>
                    {Math.round(poi.distanceMeters!)} m
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => onDetails(poi)}
              style={[styles.btn, styles.ghost]}
            >
              <Text style={styles.ghostLabel}>Details</Text>
            </Pressable>
            {onSave && (
              <Pressable
                onPress={() => onSave(poi)}
                style={[styles.btn, styles.ghost]}
              >
                <Text style={styles.ghostLabel}>Save</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => onGo(poi)}
              style={[styles.btn, styles.primary]}
            >
              <Text style={styles.primaryLabel}>Go</Text>
            </Pressable>
          </View>
        </View>
      )}
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 96, height: 72, borderRadius: 12, backgroundColor: '#111' },
  title: { color: '#fff', fontWeight: '700', fontSize: 17 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  chip: {
    color: '#cbd5e1',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  ghost: { backgroundColor: 'rgba(255,255,255,0.10)' },
  ghostLabel: { color: '#e5e7eb', fontWeight: '600' },
  primary: { backgroundColor: '#3b82f6' },
  primaryLabel: { color: '#fff', fontWeight: '700' },
})
