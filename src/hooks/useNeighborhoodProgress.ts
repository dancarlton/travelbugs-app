import { useQuery } from '@tanstack/react-query'

// TODO: replace with Supabase join of neighborhoods + stamps aggregate
export function useNeighborhoodProgress(userId: string) {
  return useQuery({
    queryKey: ['neighborhoodProgress', userId],
    queryFn: async () => [
      {
        id: 'nbhd_1',
        name: 'University Park',
        city: 'Irvine',
        completed: 3,
        total: 10,
      },
      {
        id: 'nbhd_2',
        name: 'Laguna Beach',
        city: 'Laguna',
        completed: 5,
        total: 12,
      },
    ],
  })
}
