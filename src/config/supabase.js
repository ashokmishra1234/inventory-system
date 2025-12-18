require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Missing Supabase URL or Key in environment variables.");
  // Return a dummy object so the app doesn't crash on require()
  // methods will throw when called
  supabase = {
    auth: {
      admin: {
        createUser: () => Promise.reject(new Error("Supabase Keys Missing")),
        deleteUser: () => Promise.reject(new Error("Supabase Keys Missing")),
      },
      signInWithPassword: () => Promise.reject(new Error("Supabase Keys Missing")),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.reject(new Error("Supabase Keys Missing")) }) }),
      insert: () => Promise.reject(new Error("Supabase Keys Missing")),
      update: () => Promise.reject(new Error("Supabase Keys Missing")),
      delete: () => Promise.reject(new Error("Supabase Keys Missing")),
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = supabase;
