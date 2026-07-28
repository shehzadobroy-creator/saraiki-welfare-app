import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmwbbbupccknxdvoyhfb.supabase.co';
const supabaseAnonKey = 'sb_publishable_xEvWhsI_dBR8fL7gzU_gng_JspjES15';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
