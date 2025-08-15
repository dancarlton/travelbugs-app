import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

export function usePois() {
  return useQuery({
    queryKey: ['pois'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landmarks')
        .select('id,name,latitude,longitude,category,image_url')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}
