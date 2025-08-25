"use client";
import { createContext, useState, useEffect } from "react";
import supabase_client from "@/app/api/supabase-client";

// Export context once
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase_client.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: subscription } = supabase_client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ only export AuthProvider here
export { AuthProvider };
