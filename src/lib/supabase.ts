import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvphloyzognaipgcryvw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cGhsb3l6b2duYWlwZ2NyeXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNjg2MTYsImV4cCI6MjA0Nzg0NDYxNn0.2UCa0AGUr-VjHD-j-ryxmFQu88-KFBDhmcoRQsCyF78';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DbPoll = {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  vote_codes: string[];
  used_codes: string[];
  is_public: boolean;
  used_ips: string[];
  created_at: string;
  ends_at: string;
};

// SQL to run in Supabase SQL Editor:
/*
ALTER TABLE polls 
ADD COLUMN is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN used_ips TEXT[] DEFAULT '{}';
*/