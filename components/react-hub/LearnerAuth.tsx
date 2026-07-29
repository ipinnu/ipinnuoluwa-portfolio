"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface LearnerAuthValue {
  session: Session | null;
  loading: boolean;
  learnerName: string;
  openAuth: (destination?: string) => void;
  closeAuth: () => void;
  signOut: () => Promise<void>;
}

const LearnerAuthContext = createContext<LearnerAuthValue | null>(null);
const AVAILABLE_MODULE_IDS = ["module-1", "module-2", "module-3"] as const;

async function restoreLearnerProgress(session: Session): Promise<void> {
  const { data, error } = await supabase
    .from("course_progress")
    .select("module_id, activity_id, explored")
    .eq("learner_id", session.user.id);

  if (error || !data) return;

  AVAILABLE_MODULE_IDS.forEach((moduleId) => {
    const moduleRows = data.filter((row) => row.module_id === moduleId);
    if (moduleRows.length === 0) return;
    const explored = moduleRows
      .filter((row) => row.explored)
      .map((row) => row.activity_id);
    try {
      localStorage.setItem(`react-hub-${moduleId}-explored`, JSON.stringify(explored));
    } catch {}
  });
  window.dispatchEvent(new Event("hub-module-progress-update"));
}

export function useLearnerAuth(): LearnerAuthValue {
  const value = useContext(LearnerAuthContext);
  if (!value) throw new Error("useLearnerAuth must be used inside LearnerAuthProvider");
  return value;
}

export function LearnerAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [destination, setDestination] = useState("/resources/react/module-1");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await restoreLearnerProgress(data.session);
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true);
      void (async () => {
        if (nextSession) await restoreLearnerProgress(nextSession);
        setSession(nextSession);
        setLoading(false);
      })();
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<LearnerAuthValue>(() => ({
    session,
    loading,
    learnerName:
      (session?.user.user_metadata.full_name as string | undefined)?.trim() ||
      session?.user.email?.split("@")[0] ||
      "Learner",
    openAuth: (nextDestination = "/resources/react/module-1") => {
      setDestination(nextDestination);
      setAuthOpen(true);
    },
    closeAuth: () => setAuthOpen(false),
    signOut: async () => {
      await supabase.auth.signOut();
      router.push("/resources/react/intro");
    },
  }), [loading, router, session]);

  return (
    <LearnerAuthContext.Provider value={value}>
      {children}
      {authOpen && (
        <LearnerAuthModal
          destination={destination}
          onClose={() => setAuthOpen(false)}
          onAuthenticated={() => {
            setAuthOpen(false);
            router.push(destination);
          }}
        />
      )}
    </LearnerAuthContext.Provider>
  );
}

function LearnerAuthModal({
  destination,
  onClose,
  onAuthenticated,
}: {
  destination: string;
  onClose: () => void;
  onAuthenticated: () => void;
}) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isSupabaseConfigured) {
      setError("Learner accounts need the Supabase URL and anonymous key to be configured.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}${destination}`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          onAuthenticated();
        } else {
          setMessage("Your account is ready. Check your email to confirm it, then return and sign in.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        onAuthenticated();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learner-account-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md border border-border bg-bg-primary p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close account dialog"
          className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center border border-border text-xl text-text-secondary hover:border-neon/40 hover:text-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
        >
          ×
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
          Save your laboratory
        </p>
        <h2 id="learner-account-title" className="mt-3 pr-10 font-syne text-3xl font-black text-text-primary">
          {mode === "signup" ? "Create your learner account" : "Welcome back"}
        </h2>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Your account keeps your explorations and project checkpoints connected across visits.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <label className="block text-sm font-semibold text-text-primary">
              Your name
              <input
                required
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 min-h-12 w-full border border-border bg-bg-secondary px-4 text-base font-normal text-text-primary focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20"
              />
            </label>
          )}
          <label className="block text-sm font-semibold text-text-primary">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 min-h-12 w-full border border-border bg-bg-secondary px-4 text-base font-normal text-text-primary focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20"
            />
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            Password
            <input
              required
              minLength={8}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 min-h-12 w-full border border-border bg-bg-secondary px-4 text-base font-normal text-text-primary focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20"
            />
            {mode === "signup" && (
              <span className="mt-1 block text-xs font-normal text-text-tertiary">Use at least eight characters.</span>
            )}
          </label>

          {error && <p role="alert" className="border border-red-500/40 bg-red-500/10 p-3 text-sm leading-6 text-red-300">{error}</p>}
          {message && <p role="status" className="border border-accent/40 bg-accent/10 p-3 text-sm leading-6 text-accent">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="min-h-12 w-full cursor-pointer bg-neon px-5 font-mono text-sm font-bold text-bg-primary hover:opacity-90 disabled:cursor-wait disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            {busy ? "Working…" : mode === "signup" ? "Create account and begin" : "Sign in and continue"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((current) => current === "signup" ? "signin" : "signup");
            setError("");
            setMessage("");
          }}
          className="mt-4 min-h-11 w-full cursor-pointer text-sm text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
        >
          {mode === "signup" ? "Already learning here? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}

export function RequireLearner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, loading, openAuth } = useLearnerAuth();
  const protectedRoute =
    pathname === "/resources/react/module-1" ||
    /^\/resources\/react\/(?!intro$|resources$)[^/]+$/.test(pathname);

  useEffect(() => {
    if (protectedRoute && !loading && !session) openAuth(pathname);
  }, [loading, openAuth, pathname, protectedRoute, session]);

  if (!protectedRoute) return <>{children}</>;
  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center font-mono text-sm text-text-tertiary">Loading your laboratory…</div>;
  }
  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="max-w-md text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon">Learner account required</p>
          <h1 className="mt-3 font-syne text-3xl font-black text-text-primary">Keep your work when you leave.</h1>
          <p className="mt-3 text-base leading-7 text-text-secondary">Create an account or sign in before entering the laboratory.</p>
          <button
            type="button"
            onClick={() => openAuth(pathname)}
            className="mt-6 min-h-12 cursor-pointer bg-neon px-6 font-mono text-sm font-bold text-bg-primary"
          >
            Continue to account
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
