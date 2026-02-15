export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          id: string
          prompt: string
          status: string
          duration: number
          cost: number
          video_url: string | null
          final_video_url: string | null
          task_id: string | null
          error_message: string | null
          user_id: string | null
          exercise_id: string | null
          voice_text: string | null
          voice_url: string | null
          voice_status: string | null
          voice_task_id: string | null
          ambient_type: string | null
          ambient_url: string | null
          ambient_status: string | null
          ambient_task_id: string | null
          composing_status: string | null
          generation_step: string | null
          source_video_id: string | null
          total_extensions: number | null
          current_extension: number | null
          extension_video_ids: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prompt: string
          status?: string
          duration: number
          cost?: number
          video_url?: string | null
          final_video_url?: string | null
          task_id?: string | null
          error_message?: string | null
          user_id?: string | null
          exercise_id?: string | null
          voice_text?: string | null
          voice_url?: string | null
          voice_status?: string | null
          voice_task_id?: string | null
          ambient_type?: string | null
          ambient_url?: string | null
          ambient_status?: string | null
          ambient_task_id?: string | null
          composing_status?: string | null
          generation_step?: string | null
          source_video_id?: string | null
          total_extensions?: number | null
          current_extension?: number | null
          extension_video_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prompt?: string
          status?: string
          duration?: number
          cost?: number
          video_url?: string | null
          final_video_url?: string | null
          task_id?: string | null
          error_message?: string | null
          user_id?: string | null
          exercise_id?: string | null
          voice_text?: string | null
          voice_url?: string | null
          voice_status?: string | null
          voice_task_id?: string | null
          ambient_type?: string | null
          ambient_url?: string | null
          ambient_status?: string | null
          ambient_task_id?: string | null
          composing_status?: string | null
          generation_step?: string | null
          source_video_id?: string | null
          total_extensions?: number | null
          current_extension?: number | null
          extension_video_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          prompt_full: string
          restrictions: string | null
          voice_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          prompt_full: string
          restrictions?: string | null
          voice_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          prompt_full?: string
          restrictions?: string | null
          voice_text?: string | null
          created_at?: string
        }
        Relationships: []
      }
      feed_items: {
        Row: {
          id: string
          tenant_id: string | null
          title: string
          description: string | null
          image_url: string | null
          video_url: string | null
          tags: string[] | null
          author_name: string | null
          author_avatar: string | null
          type: string | null
          target_service: string | null
          target_prompt: string | null
          is_published: boolean | null
          published_at: string | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          title: string
          description?: string | null
          image_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          author_name?: string | null
          author_avatar?: string | null
          type?: string | null
          target_service?: string | null
          target_prompt?: string | null
          is_published?: boolean | null
          published_at?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          title?: string
          description?: string | null
          image_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          author_name?: string | null
          author_avatar?: string | null
          type?: string | null
          target_service?: string | null
          target_prompt?: string | null
          is_published?: boolean | null
          published_at?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "partner_admin" | "expert" | "quality_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "partner_admin", "expert", "quality_manager"],
    },
  },
} as const
