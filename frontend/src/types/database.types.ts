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
