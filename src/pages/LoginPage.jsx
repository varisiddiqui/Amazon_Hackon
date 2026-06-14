import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth, getPostAuthRedirect } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsGuest, loginWithGoogle, isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function goAfterAuth() {
    navigate(getPostAuthRedirect(location), { replace: true });
  }

  useEffect(() => {
    if (isSignedIn) {
      goAfterAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login({ email, password });
    setLoading(false);
    if (result.ok) {
      goAfterAuth();
    } else {
      setError(result.error);
    }
  }

  function handleGuest() {
    loginAsGuest();
    goAfterAuth();
  }

  function handleGoogle() {
    loginWithGoogle();
    goAfterAuth();
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your CampusFlow account"
      footer={
        <>
          <p className="text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <p className="mt-6 text-center text-xs leading-relaxed text-on-surface-variant">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">Terms</a>
            {" "}&amp;{" "}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="w-full">
          <label className="auth-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
            className="auth-input"
          />
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="auth-input"
          />
        </div>

        <div className="text-right">
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              or
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-on-background transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google Login
        </button>

        <button
          type="button"
          onClick={handleGuest}
          className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 py-3 text-sm font-semibold text-primary transition-colors hover:bg-indigo-50"
        >
          Continue as Guest (Demo)
        </button>
      </form>
    </AuthLayout>
  );
}
