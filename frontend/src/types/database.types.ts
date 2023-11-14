import { Language } from './language';
import { QuestionCategory } from './question';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferred_interview_language: Language | null;
          website: string | null;
          role: string;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_interview_language: Language | null;
          website?: string | null;
          role: string;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_interview_language: Language | null;
          website?: string | null;
          role: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface DatabaseQuestion {
  uuid?: string;
  slug?: string;
  title: string;
  description: string;
  categories: QuestionCategory[];
  difficulty: 1 | 2 | 3;
  link: string;
}

export interface DatabaseCollab {
  room_id: string;
  created_at: Date;
  user1_id: string;
  user2_id: string;
  difficulty: 1 | 2 | 3;
  user1_code?: JSON;
  user2_code?: JSON;
  user1_notes?: JSON;
  user2_notes?: JSON;
  user1_language?: string;
  user2_language?: string;
  completed_time?: Date;
  user1_question_slug?: string;
  user2_question_slug?: string;
  user1_result?: JSON;
  user2_result?: JSON;
  is_closed?: boolean;
}