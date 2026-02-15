import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QTLog {
  id: string;
  nickname: string;
  password: string;
  content: string;
  is_public: boolean;
  bible_verse: string;
  created_at: string;
  media_url?: string;
}
