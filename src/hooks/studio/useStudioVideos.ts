// Supabase hooks for studio videos — adapted from fitflow-studio
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Video } from '@/types/studio';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useStudioVideos() {
  return useQuery({
    queryKey: ['studio-videos'],
    queryFn: async (): Promise<Video[]> => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as Video[];
    },
  });
}

export function useDeleteStudioVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string): Promise<void> => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studio-videos'] });
      toast.success('Видео удалено');
    },
    onError: () => {
      toast.error('Не удалось удалить видео');
    },
  });
}

// Poll processing videos every 10s and refresh query when done
export function useProcessingVideosPolling() {
  const { data: videos } = useStudioVideos();
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const processing = videos?.filter(v => v.status === 'processing' || v.status === 'pending') ?? [];

    if (processing.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      // Just refetch the list — Edge Functions update the DB rows
      await queryClient.invalidateQueries({ queryKey: ['studio-videos'] });
    };

    intervalRef.current = setInterval(poll, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [videos, queryClient]);
}

// Hook for feed_items from Supabase
export function useStudioFeedItems() {
  return useQuery({
    queryKey: ['studio-feed-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
