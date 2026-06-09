import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance

  const isWeb = typeof window !== 'undefined'

  const storage =
    isWeb
      ? undefined
      : require('@react-native-async-storage/async-storage').default

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,
    },
  })

  return supabaseInstance
}