import { boot } from 'quasar/wrappers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default boot(({ app }) => {
  app.provide("supabase", supabase)
})
