// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ewsbkcuznciaaekmlzby.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3c2JrY3V6bmNpYWFla21semJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTY4NjYsImV4cCI6MjA2MjMzMjg2Nn0.iVRgNKv_dn_Ma4YCrlbz_4nXvr35ah3KWoUkmjQmd28";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);