import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth, getPostAuthRedirect } from "../context/AuthContext";

const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Business Administration",
  "Other",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Faculty"];

const ROLES = [
  { id: "student", label: "Student" },
  { id: "faculty", label: "Faculty" },
  { id: "admin", label: "Club Admin" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    confirmEmail: "",
    department: DEPARTMENTS[0],
    year: YEARS[0],
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.email.trim().toLowerCase() !== form.confirmEmail.trim().toLowerCase()) {
      setError("Email addresses do not match. Please check for typos.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signup({
      ...form,
      email: form.email.trim(),
      fullName: form.fullName.trim(),
    });
    setLoading(false);
    if (result.ok) {
      navigate(getPostAuthRedirect(location), { replace: true });
    } else {
      setError(result.error);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.ok) {
      navigate(getPostAuthRedirect(location), { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join CampusFlow — your AI campus assistant"
      footer={
        <>
          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-primary hover:underline"
            >
              Login
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
          onClick={handleGoogleSignup}
          loading={googleLoading}
          disabled={loading}
          label="Sign up with Google"
        />

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              or sign up with email
            </span>
          </div>
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Name"
            className="auth-input"
          />
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="signup-email">
            College Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@college.edu"
            className="auth-input"
          />
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="signup-confirm-email">
            Confirm Email Address
          </label>
          <input
            id="signup-confirm-email"
            type="email"
            required
            autoComplete="off"
            value={form.confirmEmail}
            onChange={(e) => update("confirmEmail", e.target.value)}
            placeholder="Re-enter your email"
            className="auth-input"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="auth-label" htmlFor="signup-dept">Department</label>
            <select
              id="signup-dept"
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              className="auth-input"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="auth-label" htmlFor="signup-year">Year</label>
            <select
              id="signup-year"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
              className="auth-input"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="signup-pass">Password</label>
          <input
            id="signup-pass"
            type="password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="Min. 6 characters"
            className="auth-input"
          />
        </div>

        <div className="w-full">
          <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
          <input
            id="signup-confirm"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder="Re-enter password"
            className="auth-input"
          />
        </div>

        <div className="w-full">
          <p className="auth-label mb-3">Choose Role</p>
          <div className="flex flex-col gap-2">
            {ROLES.map((role) => (
              <label
                key={role.id}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  form.role === role.id
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-black/10 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={form.role === role.id}
                  onChange={() => update("role", role.id)}
                  className="accent-indigo-600"
                />
                <span className="text-sm font-medium text-on-background">{role.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
