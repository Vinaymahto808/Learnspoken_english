export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          xp: number
          level: number
          streak: number
          last_active: string
          total_lessons_completed: number
          total_practice_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          streak?: number
          last_active?: string
          total_lessons_completed?: number
          total_practice_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          streak?: number
          last_active?: string
          total_lessons_completed?: number
          total_practice_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          xp_reward: number
          audio_url: string | null
          transcript: string | null
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          xp_reward?: number
          audio_url?: string | null
          transcript?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
          xp_reward?: number
          audio_url?: string | null
          transcript?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          score: number
          attempts: number
          completed_at: string | null
          time_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          score?: number
          attempts?: number
          completed_at?: string | null
          time_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          score?: number
          attempts?: number
          completed_at?: string | null
          time_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      speech_submissions: {
        Row: {
          id: string
          user_id: string
          lesson_id: string | null
          audio_url: string | null
          transcription: string | null
          analysis: Json | null
          score: number | null
          feedback: string | null
          pronunciation_score: number | null
          grammar_score: number | null
          fluency_score: number | null
          vocabulary_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id?: string | null
          audio_url?: string | null
          transcription?: string | null
          analysis?: Json | null
          score?: number | null
          feedback?: string | null
          pronunciation_score?: number | null
          grammar_score?: number | null
          fluency_score?: number | null
          vocabulary_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string | null
          audio_url?: string | null
          transcription?: string | null
          analysis?: Json | null
          score?: number | null
          feedback?: string | null
          pronunciation_score?: number | null
          grammar_score?: number | null
          fluency_score?: number | null
          vocabulary_score?: number | null
          created_at?: string
        }
      }
      daily_challenges: {
        Row: {
          id: string
          prompt: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          category: string
          active_date: string
          max_duration: number
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          category: string
          active_date: string
          max_duration?: number
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt?: string
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
          category?: string
          active_date?: string
          max_duration?: number
          xp_reward?: number
          created_at?: string
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          score: number | null
          transcription: string | null
          feedback: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          score?: number | null
          transcription?: string | null
          feedback?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          score?: number | null
          transcription?: string | null
          feedback?: string | null
          completed_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          message_count: number
        }
        Insert: {
          id?: string
          user_id: string
          started_at?: string
          ended_at?: string | null
          message_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          ended_at?: string | null
          message_count?: number
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
