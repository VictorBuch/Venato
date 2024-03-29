import { createClient } from '@supabase/supabase-js';

const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true
	}
});
