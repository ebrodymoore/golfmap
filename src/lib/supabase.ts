// Simplified Supabase client for deployment
// Replace with actual Supabase configuration when ready

export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => ({ data: null, error: new Error('Supabase not configured') }),
        then: (callback: any) => callback({ data: [], error: null })
      }),
      order: (column: string, options?: any) => ({
        then: (callback: any) => callback({ data: [], error: null })
      }),
      limit: (count: number) => ({
        then: (callback: any) => callback({ data: [], error: null })
      }),
      not: (column: string, operator: string, value: any) => ({
        then: (callback: any) => callback({ data: [], error: null })
      }),
      then: (callback: any) => callback({ data: [], error: null })
    }),
    insert: (data: any) => ({
      select: (columns: string = '*') => ({
        single: () => ({ data: null, error: new Error('Supabase not configured') }),
        then: (callback: any) => callback({ data: null, error: new Error('Supabase not configured') })
      }),
      then: (callback: any) => callback({ data: null, error: new Error('Supabase not configured') })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns: string = '*') => ({
          single: () => ({ data: null, error: new Error('Supabase not configured') }),
          then: (callback: any) => callback({ data: null, error: new Error('Supabase not configured') })
        }),
        then: (callback: any) => callback({ error: new Error('Supabase not configured') })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: (callback: any) => callback({ error: new Error('Supabase not configured') })
      })
    }),
    upsert: (data: any, options?: any) => ({
      then: (callback: any) => callback({ error: new Error('Supabase not configured') })
    })
  }),
  auth: {
    getUser: () => ({ data: { user: null } }),
    signUp: (credentials: any) => ({ data: null, error: new Error('Auth not configured') }),
    signInWithPassword: (credentials: any) => ({ data: null, error: new Error('Auth not configured') }),
    signOut: () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  }
}