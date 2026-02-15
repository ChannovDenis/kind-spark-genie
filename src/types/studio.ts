// Studio types — adapted from fitflow-studio (content-studio/src/types/index.ts)

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AudioStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AmbientType = 'gym' | 'outdoor' | 'studio';
export type VideoDuration = 15 | 30;

export interface Video {
  id: string;
  exercise_id: string | null;
  prompt: string;
  duration: VideoDuration;
  status: VideoStatus;
  video_url: string | null;
  cost: number;
  task_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  generation_step: string | null;
  current_extension: number | null;
  total_extensions: number | null;
  source_video_id: string | null;
  extension_video_ids: string[] | null;
  voice_text: string | null;
  voice_task_id: string | null;
  voice_url: string | null;
  voice_status: AudioStatus | null;
  ambient_task_id: string | null;
  ambient_url: string | null;
  ambient_status: AudioStatus | null;
  ambient_type: AmbientType | null;
  final_video_url: string | null;
  composing_status: AudioStatus | null;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  prompt_full: string;
  voice_text: string | null;
  restrictions: string | null;
  created_at: string;
}

export function getGenerationProgress(video: Video): string {
  if (!video.generation_step || video.generation_step === 'base') {
    return 'Генерация базового видео...';
  }
  if (video.generation_step.startsWith('ready_for_extension_')) {
    const num = video.generation_step.replace('ready_for_extension_', '');
    return `Подготовка расширения ${num}/${video.total_extensions}...`;
  }
  if (video.generation_step.startsWith('extending_')) {
    const num = video.generation_step.replace('extending_', '');
    return `Расширение видео ${num}/${video.total_extensions}...`;
  }
  if (video.generation_step === 'completed') {
    return 'Завершено';
  }
  return 'Обработка...';
}

export function getAudioStatusText(status: AudioStatus | null): string {
  switch (status) {
    case 'pending': return 'Ожидание';
    case 'processing': return 'Генерация...';
    case 'completed': return 'Готово';
    case 'failed': return 'Ошибка';
    default: return 'Не начато';
  }
}
