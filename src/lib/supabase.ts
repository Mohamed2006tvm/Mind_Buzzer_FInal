import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ' https://dhoyskiuvanubdghtqso.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_y5wNTUtTbicC58K8f8Z7Ug_nvwuu7gP';

export const supabase = createClient(supabaseUrl, supabaseKey);
