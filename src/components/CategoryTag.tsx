import { Text, Pressable } from 'react-native'

export default function CategoryTag({
  label,
  selected,
  onPress,
}: {
  label: string
  selected?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? '#0a84ff' : '#e5e5e5',
        backgroundColor: selected ? 'rgba(10,132,255,0.1)' : 'white',
        marginRight: 8,
      }}
    >
      <Text style={{ fontWeight: '600' }}>{label}</Text>
    </Pressable>
  )
}
