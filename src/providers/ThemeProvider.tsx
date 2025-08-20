import { PropsWithChildren } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {children}
    </GestureHandlerRootView>
  )
}
