import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

/** After login/signup: home page by default, or return to the page user tried to open. */
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser());

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = useCallback(({ email, password }) => {
    const stored = loadStoredUser();
    if (stored?.email === email && stored?.password === password) {
      setUser({ ...stored, password: undefined });
      return { ok: true, role: stored.role };
    }

    // Demo fallback for hackathon
    if (email && password.length >= 4) {
      const demoUser = {
        id: "demo-1",
        fullName: "Avinash Singh",
        email,
        department: "Computer Science",
        year: "3rd Year",
        role: "student",
        imageUrl: null,
        isGuest: false,
      };
      setUser(demoUser);
      return { ok: true, role: "student" };
    }

    return { ok: false, error: "Invalid email or password." };
  }, []);

  const signup = useCallback((data) => {
    const newUser = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      department: data.department,
      year: data.year,
      role: data.role || "student",
      password: data.password,
      imageUrl: null,
      isGuest: false,
    };
    saveUser(newUser);
    setUser({ ...newUser, password: undefined });
    return { ok: true, role: newUser.role };
  }, []);

  const loginAsGuest = useCallback(() => {
    const guest = {
      id: "guest",
      fullName: "Demo Student",
      email: "guest@campusflow.demo",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      imageUrl: null,
      isGuest: true,
    };
    setUser(guest);
    return { ok: true, role: "student" };
  }, []);

  const loginWithGoogle = useCallback(() => {
    const googleUser = {
      id: "google-demo",
      fullName: "Avinash Singh",
      email: "avinash@gmail.com",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      imageUrl: null,
      isGuest: false,
    };
    setUser(googleUser);
    return { ok: true, role: "student" };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      user,
      isSignedIn: Boolean(user),
      login,
      signup,
      loginAsGuest,
      loginWithGoogle,
      logout,
    }),
    [user, login, signup, loginAsGuest, loginWithGoogle, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
