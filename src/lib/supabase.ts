import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check for missing environment variables
export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  console.error('❌ Missing Supabase environment variables:', missingVars.join(', '))
  console.error('Please configure these variables in your Vercel project settings.')
}

// Create client with placeholder values if config is missing
// This prevents the app from crashing, but operations will fail gracefully
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
