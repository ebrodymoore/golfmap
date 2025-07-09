// Simplified Supabase client for deployment
// Replace with actual Supabase configuration when ready

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: unknown) => ({
        single: () => ({ data: null, error: new Error('Supabase not configured') }),
        then: (callback: (result: { data: unknown[]; error: null }) => void) => callback({ data: [], error: null })
      }),
      order: (column: string, options?: unknown) => ({
        then: (callback: (result: { data: unknown[]; error: null }) => void) => callback({ data: [], error: null })
      }),
      limit: (count: number) => ({
        then: (callback: (result: { data: unknown[]; error: null }) => void) => callback({ data: [], error: null })
      }),
      not: (column: string, operator: string, value: unknown) => ({
        then: (callback: (result: { data: unknown[]; error: null }) => void) => callback({ data: [], error: null })
      }),
      then: (callback: (result: { data: unknown[]; error: null }) => void) => callback({ data: [], error: null })
    }),
    insert: (data: unknown) => ({
      select: (columns = '*') => ({
        single: () => ({ data: null, error: new Error('Supabase not configured') }),
        then: (callback: (result: { data: null; error: Error }) => void) => callback({ data: null, error: new Error('Supabase not configured') })
      }),
      then: (callback: (result: { data: null; error: Error }) => void) => callback({ data: null, error: new Error('Supabase not configured') })
    }),
    update: (data: unknown) => ({
      eq: (column: string, value: unknown) => ({
        select: (columns = '*') => ({
          single: () => ({ data: null, error: new Error('Supabase not configured') }),
          then: (callback: (result: { data: null; error: Error }) => void) => callback({ data: null, error: new Error('Supabase not configured') })
        }),
        then: (callback: (result: { error: Error }) => void) => callback({ error: new Error('Supabase not configured') })
      })
    }),
    delete: () => ({
      eq: (column: string, value: unknown) => ({
        then: (callback: (result: { error: Error }) => void) => callback({ error: new Error('Supabase not configured') })
      })
    }),
    upsert: (data: unknown, options?: unknown) => ({
      then: (callback: (result: { error: Error }) => void) => callback({ error: new Error('Supabase not configured') })
    })
  }),
  auth: {
    getUser: () => ({ data: { user: null } }),
    signUp: (credentials: unknown) => ({ data: null, error: new Error('Auth not configured') }),
    signInWithPassword: (credentials: unknown) => ({ data: null, error: new Error('Auth not configured') }),
    signOut: () => ({ error: null }),
    onAuthStateChange: (callback: unknown) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  }
}