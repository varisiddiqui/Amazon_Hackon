import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getToken, setToken, clearToken } from "../lib/apiClient";
import * as api from "../services/api";
import { isFirebaseConfigured } from "../firebase/firebase.js";
import {
  signInWithGoogle,
  signOutGoogle,
  subscribeToAuthChanges,
  ensureFirestoreUser,
  mapFirebaseToAppUser,
} from "../firebase/authService.js";

const STORAGE_KEY = "campusflow_auth";

const AuthContext = createContext(null);

export function getDashboardPath(role) {
  switch (role) {
    case "faculty":
      return "/faculty-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/dashboard";
  }
}

export function getPostAuthRedirect(location) {
  const from = location?.state?.from;
  if (from?.pathname && !["/login", "/signup"].includes(from.pathname)) {
    return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
  }

  const next = new URLSearchParams(location?.search ?? "").get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/";
}

export function loginRedirectState(targetPath, search = "") {
  return { from: { pathname: targetPath, search } };
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

async function syncFirebaseUser(firebaseUser) {
  const firestoreUser = await ensureFirestoreUser(firebaseUser);
  const { user: backendUser, token } = await api.loginFirebase({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    fullName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role: firestoreUser.role || "student",
  });

  setToken(token);
  return mapFirebaseToAppUser(firebaseUser, firestoreUser, backendUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser());
  const [authLoading, setAuthLoading] = useState(true);
  const firebaseHandled = useRef(false);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapJwtSession() {
      const token = getToken();
      if (!token) return false;

      try {
        const me = await api.getMe();
        if (!cancelled) setUser(me);
        return true;
      } catch {
        clearToken();
        if (!cancelled) setUser(null);
        return false;
      }
    }

    if (isFirebaseConfigured) {
      const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
        if (cancelled) return;

        if (firebaseUser) {
          firebaseHandled.current = true;
          try {
            const appUser = await syncFirebaseUser(firebaseUser);
            if (!cancelled) setUser(appUser);
          } catch (err) {
            console.error("Firebase auth sync failed:", err);
            if (!cancelled) setUser(null);
          } finally {
            if (!cancelled) setAuthLoading(false);
          }
          return;
        }

        firebaseHandled.current = false;
        await bootstrapJwtSession();
        if (!cancelled) setAuthLoading(false);
      });

      return () => {
        cancelled = true;
        unsubscribe();
      };
    }

    bootstrapJwtSession().finally(() => {
      if (!cancelled) setAuthLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const { user: loggedIn, token } = await api.login({
        email: email.trim().toLowerCase(),
        password,
      });
      setToken(token);
      setUser(loggedIn);
      return { ok: true, role: loggedIn?.role || "student" };
    } catch (err) {
      return { ok: false, error: err.message || "Invalid email or password." };
    }
  }, []);

  const signup = useCallback(async (data) => {
    try {
      const { user: created, token } = await api.register({
        fullName: data.fullName?.trim(),
        email: data.email?.trim().toLowerCase(),
        password: data.password,
        department: data.department,
        year: data.year,
        role: data.role || "student",
      });
      setToken(token);
      setUser(created);
      return { ok: true, role: created?.role || "student" };
    } catch (err) {
      return { ok: false, error: err.message || "Signup failed." };
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      const { user: guest, token } = await api.loginGuest();
      setToken(token);
      setUser(guest);
      return { ok: true, role: guest.role };
    } catch (err) {
      return { ok: false, error: err.message || "Guest login failed." };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      if (!isFirebaseConfigured) {
        const { user: googleUser, token } = await api.loginGoogle();
        setToken(token);
        setUser(googleUser);
        return { ok: true, role: googleUser.role };
      }

      const { firebaseUser, firestoreUser } = await signInWithGoogle();
      const { user: backendUser, token } = await api.loginFirebase({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: firestoreUser.role || "student",
      });

      setToken(token);
      const appUser = mapFirebaseToAppUser(firebaseUser, firestoreUser, backendUser);
      setUser(appUser);
      return { ok: true, role: appUser.role };
    } catch (err) {
      const message =
        err.code === "auth/popup-closed-by-user"
          ? "Sign-in cancelled."
          : err.message || "Google sign-in failed.";
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    clearToken();
    setUser(null);
    try {
      await signOutGoogle();
    } catch {
      /* ignore */
    }
  }, []);

  const updateUser = useCallback(async (patch) => {
    try {
      const updated = await api.updateProfile(patch);
      setUser(updated);
      return { ok: true, user: updated };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isSignedIn: Boolean(user),
      authLoading,
      login,
      signup,
      loginAsGuest,
      loginWithGoogle,
      logout,
      updateUser,
      isFirebaseConfigured,
    }),
    [user, authLoading, login, signup, loginAsGuest, loginWithGoogle, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
