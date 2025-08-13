import { View, Image, Text } from 'react-native'

export default function NearbyCard({
  title,
  subtitle,
  metaText,
  imageUrl,
}: {
  title: string
  subtitle?: string
  metaText?: string // e.g., "Free", "$4/visit", "0.4 mi"
  imageUrl?: string
}) {
  return (
    <View
      style={{
        width: 220,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: imageUrl ?? 'https://picsum.photos/400/240' }}
        style={{ width: '100%', height: 120 }}
      />
      <View style={{ padding: 12, gap: 4 }}>
        <Text style={{ fontWeight: '700' }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ opacity: 0.7 }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {metaText ? (
          <Text style={{ marginTop: 4, color: '#0a84ff', fontWeight: '700' }}>
            {metaText}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
