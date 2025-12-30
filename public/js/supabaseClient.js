// public/js/supabaseClient.js
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from "./config.js";

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
);
