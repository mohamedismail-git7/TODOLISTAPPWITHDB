// supabaseClient.js
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://juwadmxuvqjrobaaibhu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d2FkbXh1dnFqcm9iYWFpYmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDUxNDYsImV4cCI6MjA2ODgyMTE0Nn0.L2dQ2D16rNSS65iTn-LXuGcvVDzq5LX1mdOmUUllynU';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
