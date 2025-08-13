import { View, Text, Pressable } from 'react-native'

export default function NeighborhoodProgressCard({
  name,
  city,
  completed,
  total,
  onPress,
}: {
  name: string
  city?: string
  completed: number
  total: number
  onPress?: () => void
}) {
  const pct = total ? Math.round((completed / total) * 100) : 0
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontWeight: '700' }}>{name}</Text>
      {city ? (
        <Text style={{ opacity: 0.7, marginBottom: 8 }}>{city}</Text>
      ) : null}
      <View
        style={{
          height: 8,
          backgroundColor: '#eee',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: '#1fb0a6',
          }}
        />
      </View>
      <Text style={{ opacity: 0.7 }}>
        {completed}/{total} landmarks stamped • {pct}% complete
      </Text>
    </Pressable>
  )
}
