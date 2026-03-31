import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client only if configured, otherwise create a dummy that will show config error
let supabaseInstance: SupabaseClient;

if (isSupabaseConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a minimal placeholder - actual usage will check isSupabaseConfigured first
  supabaseInstance = null as unknown as SupabaseClient;
}

export const supabase = supabaseInstance;

// Helper to wrap queries with user-friendly error handling
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: { message: string; code?: string } | null }>,
  options?: {
    onAuthError?: () => void;
    onPermissionError?: () => void;
  }
): Promise<{ data: T | null; error: string | null; isAuthError: boolean; isPermissionError: boolean }> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: 'Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.',
      isAuthError: false,
      isPermissionError: false,
    };
  }

  try {
    const { data, error } = await queryFn();
    
    if (error) {
      const isAuthError = error.code === '401' || error.message?.toLowerCase().includes('not authenticated');
      const isPermissionError = error.code === '403' || error.code === '42501' || error.message?.toLowerCase().includes('permission denied');
      
      if (isAuthError && options?.onAuthError) {
        options.onAuthError();
      }
      if (isPermissionError && options?.onPermissionError) {
        options.onPermissionError();
      }
      
      return {
        data: null,
        error: isAuthError 
          ? 'Please sign in to continue.' 
          : isPermissionError 
            ? 'You do not have permission to access this resource.'
            : error.message,
        isAuthError,
        isPermissionError,
      };
    }
    
    return { data, error: null, isAuthError: false, isPermissionError: false };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
      isAuthError: false,
      isPermissionError: false,
    };
  }
}

export default supabase;
        
