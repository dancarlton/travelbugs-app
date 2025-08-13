import { useQuery } from '@tanstack/react-query'

export type Landmark = {
  id: string
  title: string
  subtitle?: string
  lat: number
  lon: number
  imageUrl?: string
}

export function useLandmarksNearby() {
  return useQuery<Landmark[]>({
    queryKey: ['landmarksNearby'],
    queryFn: async () => [
      {
        id: 'upl',
        title: 'University Park Library',
        subtitle: 'Irvine',
        lat: 33.6598,
        lon: -117.8236,
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/58e2d1d32994ca63f3cf33bd/1642575513812-K68TIE50U343ECMORTAK/Screen+Shot+2022-01-18+at+10.57.17+PM.png',
      },
      {
        id: 'mason',
        title: 'William R. Mason Regional Park',
        subtitle: 'Irvine',
        lat: 33.6632,
        lon: -117.8248,
        imageUrl: 'https://picsum.photos/seed/mason/400/240',
      },
      {
        id: 'adventure',
        title: 'Adventure Playground',
        subtitle: 'Irvine',
        lat: 33.6534,
        lon: -117.829,
        imageUrl: 'https://picsum.photos/seed/adventure/400/240',
      },
      {
        id: 'tanaka',
        title: 'Tanaka Farms',
        subtitle: 'Irvine',
        lat: 33.6591,
        lon: -117.7893,
        imageUrl: 'https://picsum.photos/seed/tanaka/400/240',
      },
      {
        id: 'aldrich',
        title: 'Aldrich Park (UCI)',
        subtitle: 'Irvine',
        lat: 33.6463,
        lon: -117.842,
        imageUrl: 'https://picsum.photos/seed/aldrich/400/240',
      },
    ],
    staleTime: 30_000,
  })
}
