import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check for missing environment variables
export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

console.log('[supabase.ts] Config check - URL:', !!supabaseUrl, 'Key:', !!supabaseAnonKey, 'Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server')

if (!hasSupabaseConfig) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  console.error('❌ Missing Supabase environment variables:', missingVars.join(', '))
  console.error('Please configure these variables in your Vercel project settings.')
}

// #region agent log
fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.ts:16',message:'Supabase config check',data:{hasConfig:hasSupabaseConfig,hasUrl:!!supabaseUrl,hasKey:!!supabaseAnonKey,urlPreview:supabaseUrl?.substring(0,30)||'missing'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

// Create client with placeholder values if config is missing
// This prevents the app from crashing, but operations will fail gracefully
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
