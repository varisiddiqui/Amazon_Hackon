import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth, getPostAuthRedirect } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsGuest, loginWithGoogle, isSignedIn, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function goAfterAuth() {
    navigate(getPostAuthRedirect(location), { replace: true });
  }

  useEffect(() => {
    if (!authLoading && isSignedIn) {
      goAfterAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, authLoading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login({ email: email.trim(), password });
    setLoading(false);
    if (result.ok) {
      goAfterAuth();
    } else {
      setError(result.error);
    }
  }

  async function handleGuest() {
    setLoading(true);
    const result = await loginAsGuest();
    setLoading(false);
    if (result.ok) goAfterAuth();
    else setError(result.error);
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.ok) goAfterAuth();
    else setError(result.error);
  }

  if (authLoading) {
    return (
      <AuthLayout title="Welcome Back" subtitle="Checking your session...">
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      </AuthLayout>
    );
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

        <GoogleSignInButton
          onClick={handleGoogle}
          loading={googleLoading}
          disabled={loading}
        />

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              or continue with email
            </span>
          </div>
        </div>

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
          disabled={loading || googleLoading}
          className="btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleGuest}
          disabled={loading || googleLoading}
          className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 py-3 text-sm font-semibold text-primary transition-colors hover:bg-indigo-50 disabled:opacity-60"
        >
          Continue as Guest (Demo)
        </button>
      </form>
    </AuthLayout>
  );
}
