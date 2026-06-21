export const env = {
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  etsyClientId: process.env.ETSY_CLIENT_ID,
  etsyClientSecret: process.env.ETSY_CLIENT_SECRET,
  pinterestClientId: process.env.PINTEREST_CLIENT_ID,
  pinterestClientSecret: process.env.PINTEREST_CLIENT_SECRET
};

export const demoMode = !(
  env.databaseUrl &&
  env.supabaseUrl &&
  env.supabaseAnonKey &&
  (env.geminiApiKey || env.openaiApiKey) &&
  env.etsyClientId &&
  env.etsyClientSecret &&
  env.pinterestClientId &&
  env.pinterestClientSecret
);

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isDatabaseConfigured = Boolean(env.databaseUrl);
export const isGeminiConfigured = Boolean(env.geminiApiKey);
export const isOpenAiConfigured = Boolean(env.openaiApiKey);
export const isAiConfigured = Boolean(env.geminiApiKey || env.openaiApiKey);
export const isEtsyConfigured = Boolean(env.etsyClientId && env.etsyClientSecret);
export const isPinterestConfigured = Boolean(env.pinterestClientId && env.pinterestClientSecret);
