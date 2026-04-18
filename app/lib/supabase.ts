import { createClient } from '@supabase/supabase-js';

// Đây là thông tin kết nối Database của ông
const supabaseUrl = 'https://vqtultsrgiwjoilzeaeu.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdHVsdHNyZ2l3am9pbHplYWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNDk2MjIsImV4cCI6MjA5MDgyNTYyMn0._itDLJx5Q28LRb6U9nVrHn_gsidtz_LeFeqffEmqAyE';

export const supabase = createClient(supabaseUrl, supabaseKey);
