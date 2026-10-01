import { createClient } from '@supabase/supabase-js'

//erstellt einen Client zur Kommunikation mit Supabase (mit geheimem Schlüssel für erweiterte Rechte)
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
)