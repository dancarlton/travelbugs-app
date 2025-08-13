import { View, Text, Pressable } from 'react-native'

export default function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string
  onSeeAll?: () => void
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll}>
          <Text style={{ color: '#0a84ff', fontWeight: '600' }}>See All</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
