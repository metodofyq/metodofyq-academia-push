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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      autonomous_communities: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          status?: string | null
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          exercise_ids: string[]
          id: string
          is_completed: boolean
          student_id: string
          task_date: string
          task_type: string
          topic_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exercise_ids?: string[]
          id?: string
          is_completed?: boolean
          student_id: string
          task_date?: string
          task_type: string
          topic_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exercise_ids?: string[]
          id?: string
          is_completed?: boolean
          student_id?: string
          task_date?: string
          task_type?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_attempts: {
        Row: {
          answer: string
          attempted_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          score: number
          student_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          answer: string
          attempted_at?: string
          exercise_id: string
          id?: string
          is_correct: boolean
          score?: number
          student_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          answer?: string
          attempted_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          score?: number
          student_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          image_url: string | null
          is_active: boolean
          level: number
          options: Json | null
          points: number
          question: string
          tolerance: number | null
          topic_id: string
          type: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          level: number
          options?: Json | null
          points?: number
          question: string
          tolerance?: number | null
          topic_id: string
          type: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          level?: number
          options?: Json | null
          points?: number
          question?: string
          tolerance?: number | null
          topic_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      free_courses: {
        Row: {
          ccaa_id: string
          certification: string | null
          compatibility_score: number | null
          course_type: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          hours_certified: number | null
          id: string
          modality: string | null
          provider: string | null
          provider_name: string | null
          registration_deadline: string | null
          registration_status: string | null
          source_url: string | null
          specialties: string[] | null
          start_date: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string
          vacancies: number | null
        }
        Insert: {
          ccaa_id: string
          certification?: string | null
          compatibility_score?: number | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          hours_certified?: number | null
          id?: string
          modality?: string | null
          provider?: string | null
          provider_name?: string | null
          registration_deadline?: string | null
          registration_status?: string | null
          source_url?: string | null
          specialties?: string[] | null
          start_date?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          url: string
          vacancies?: number | null
        }
        Update: {
          ccaa_id?: string
          certification?: string | null
          compatibility_score?: number | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          hours_certified?: number | null
          id?: string
          modality?: string | null
          provider?: string | null
          provider_name?: string | null
          registration_deadline?: string | null
          registration_status?: string | null
          source_url?: string | null
          specialties?: string[] | null
          start_date?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string
          vacancies?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "free_courses_ccaa_id_fkey"
            columns: ["ccaa_id"]
            isOneToOne: false
            referencedRelation: "autonomous_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ccaa: string
          created_at: string | null
          email: string
          id: string
          situacion: string | null
          source: string | null
        }
        Insert: {
          ccaa: string
          created_at?: string | null
          email: string
          id?: string
          situacion?: string | null
          source?: string | null
        }
        Update: {
          ccaa?: string
          created_at?: string | null
          email?: string
          id?: string
          situacion?: string | null
          source?: string | null
        }
        Relationships: []
      }
      level_attempts: {
        Row: {
          completed_at: string
          id: string
          level: number
          score_pct: number
          student_id: string
          topic_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          level: number
          score_pct?: number
          student_id: string
          topic_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          level?: number
          score_pct?: number
          student_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "level_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "level_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_size_bytes: number | null
          file_type: string
          file_url: string
          id: string
          is_public: boolean
          teacher_id: string
          title: string
          topic_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_size_bytes?: number | null
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean
          teacher_id: string
          title: string
          topic_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_size_bytes?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean
          teacher_id?: string
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          frequency: string | null
          id: string
          name: string
          price: number
          recommended: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          frequency?: string | null
          id?: string
          name: string
          price: number
          recommended?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          frequency?: string | null
          id?: string
          name?: string
          price?: number
          recommended?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ccaa: string | null
          created_at: string
          email: string
          full_name: string | null
          grupo: number | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          ccaa?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          grupo?: number | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          ccaa?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          grupo?: number | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_courses: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "free_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      spaced_repetition: {
        Row: {
          ease_factor: number
          id: string
          interval_days: number
          last_reviewed_at: string | null
          next_review_date: string
          repetitions: number
          student_id: string
          topic_id: string
        }
        Insert: {
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_date?: string
          repetitions?: number
          student_id: string
          topic_id: string
        }
        Update: {
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_date?: string
          repetitions?: number
          student_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaced_repetition_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spaced_repetition_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plan_topics: {
        Row: {
          id: string
          order_index: number
          scheduled_date: string | null
          study_plan_id: string
          topic_id: string
        }
        Insert: {
          id?: string
          order_index: number
          scheduled_date?: string | null
          study_plan_id: string
          topic_id: string
        }
        Update: {
          id?: string
          order_index?: number
          scheduled_date?: string | null
          study_plan_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_topics_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          started_at: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          started_at?: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          started_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_infografias: {
        Row: {
          created_at: string
          id: string
          label: string | null
          order_index: number
          storage_path: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          order_index?: number
          storage_path: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          order_index?: number
          storage_path?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_infografias_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_level4_legislacion: {
        Row: {
          ccaa: string
          content_md: string | null
          created_at: string
          id: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          ccaa: string
          content_md?: string | null
          created_at?: string
          id?: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          ccaa?: string
          content_md?: string | null
          created_at?: string
          id?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_level4_legislacion_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_levels: {
        Row: {
          content_json: Json | null
          content_md: string | null
          created_at: string
          id: string
          level: number
          title: string
          topic_id: string
          video_url: string | null
        }
        Insert: {
          content_json?: Json | null
          content_md?: string | null
          created_at?: string
          id?: string
          level: number
          title: string
          topic_id: string
          video_url?: string | null
        }
        Update: {
          content_json?: Json | null
          content_md?: string | null
          created_at?: string
          id?: string
          level?: number
          title?: string
          topic_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_levels_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_n3_images: {
        Row: {
          anchor_text: string
          caption: string | null
          created_at: string
          dibujar_hint: string | null
          id: string
          order_index: number
          storage_path: string
          topic_id: string
        }
        Insert: {
          anchor_text: string
          caption?: string | null
          created_at?: string
          dibujar_hint?: string | null
          id?: string
          order_index?: number
          storage_path: string
          topic_id: string
        }
        Update: {
          anchor_text?: string
          caption?: string | null
          created_at?: string
          dibujar_hint?: string | null
          id?: string
          order_index?: number
          storage_path?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_n3_images_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_progress: {
        Row: {
          current_level: number
          first_studied_at: string | null
          id: string
          is_unlocked: boolean
          last_studied_at: string | null
          student_id: string
          topic_id: string
          total_time_min: number
        }
        Insert: {
          current_level?: number
          first_studied_at?: string | null
          id?: string
          is_unlocked?: boolean
          last_studied_at?: string | null
          student_id: string
          topic_id: string
          total_time_min?: number
        }
        Update: {
          current_level?: number
          first_studied_at?: string | null
          id?: string
          is_unlocked?: boolean
          last_studied_at?: string | null
          student_id?: string
          topic_id?: string
          total_time_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_rubricas: {
        Row: {
          ccaa: string
          created_at: string
          criterios: Json | null
          id: string
          pesos: Json | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          ccaa: string
          created_at?: string
          criterios?: Json | null
          id?: string
          pesos?: Json | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          ccaa?: string
          created_at?: string
          criterios?: Json | null
          id?: string
          pesos?: Json | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_rubricas_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          code: string
          created_at: string
          description: string | null
          estimated_days: number
          id: string
          order_index: number
          subject: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          estimated_days?: number
          id?: string
          order_index: number
          subject: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          estimated_days?: number
          id?: string
          order_index?: number
          subject?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: never; Returns: string }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
          versioning_status: string
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
          versioning_status?: string
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
          versioning_status?: string
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          archived_at: string | null
          bucket_id: string | null
          created_at: string | null
          id: string
          is_delete_marker: boolean
          is_versioned: boolean
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          archived_at?: string | null
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          is_delete_marker?: boolean
          is_versioned?: boolean
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          archived_at?: string | null
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          is_delete_marker?: boolean
          is_versioned?: boolean
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
