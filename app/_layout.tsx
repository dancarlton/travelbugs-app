import { Stack } from 'expo-router'
import QueryProvider from '../src/app-providers/QueryProvider'
import SupabaseProvider from '../src/app-providers/SupabaseProvider'
import ThemeProvider from '../src/app-providers/ThemeProvider'
import MapboxGL from '@rnmapbox/maps'
import Constants from 'expo-constants'

// DEBUG SNITCH: logs exactly where a Fragment receives `sourceID`
import React from 'react'

const __origCreateElement = React.createElement
React.createElement = (type: any, props: any, ...children: any[]) => {
  if (
    type === React.Fragment &&
    props &&
    Object.prototype.hasOwnProperty.call(props, 'sourceID')
  ) {
    // This prints a stack pointing to the exact file/line that rendered it
    console.error('Fragment received sourceID here:\n', new Error().stack)
  }
  return __origCreateElement(type, props, ...children)
}

// Set Mapbox token once here
MapboxGL.setAccessToken(
  (Constants.expoConfig?.extra?.MAPBOX_TOKEN as string) ??
    (Constants.manifest as any)?.extra?.MAPBOX_TOKEN
)
MapboxGL.setTelemetryEnabled(false)

// DEBUG WRAP: warns if a Fragment is a direct child of ShapeSource
const RealShapeSource = MapboxGL.ShapeSource as any
MapboxGL.ShapeSource = ((props: any) => {
  React.Children.forEach(props.children, child => {
    if (child && child.type === React.Fragment) {
      console.error(
        'A React.Fragment is a direct child of <MapboxGL.ShapeSource id=%s>. Replace the fragment with an array [].',
        props?.id
      )
    }
  })
  return React.createElement(RealShapeSource, props)
}) as any

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}

