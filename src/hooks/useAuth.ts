import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "manager" | "warehouse" | "sales" | "developer";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  profile: { display_name: string | null; email: string | null } | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshRoles: () => Promise<void>;
}

export type AuthContext = AuthState & AuthActions;

export function useAuthState(): AuthContext {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [profile, setProfile] = useState<AuthState["profile"]>(null);

  const isAdmin = roles.includes("admin");
  const isAuthenticated = !!user;

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [rolesRes, profileRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("profiles").select("display_name, email").eq("id", userId).single(),
      ]);
      if (rolesRes.data) setRoles(rolesRes.data.map((r) => r.role as AppRole));
      if (profileRes.data) setProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const refreshRoles = useCallback(async () => {
    if (user) await fetchUserData(user.id);
  }, [user, fetchUserData]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => fetchUserData(session.user.id), 0);
      } else {
        setRoles([]);
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchUserData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-wachtwoord`,
    });
    return { error: error as Error | null };
  };

  return {
    user, session, loading, roles, isAdmin, isAuthenticated, profile,
    signIn, signOut, resetPassword, refreshRoles,
  };
}
