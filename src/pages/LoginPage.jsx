import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auth state from Redux
  const auth = useSelector((state) => state.auth);
  const loading = auth.status === "loading";
  const isAuthenticated = auth.isAuthenticated;
  const loginError = auth.error;
  const isInitialized = auth.isInitialized;

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate("/today", { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  useEffect(() => {
    if (loginError) {
      setError(loginError || "Invalid email or password. Please try again.");
    }
  }, [loginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Dispatch login with email and password
      await dispatch(login({ email, password })).unwrap();
      // Navigation will happen automatically via useEffect when isAuthenticated becomes true
    } catch (err) {
      setError(err || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 text-neutral-50 shadow-2xl backdrop-blur-sm sm:p-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src="favicon.svg" className="w-10" alt="Continuum Logo" />
          <h1 className="text-3xl font-semibold tracking-tight">Continuum</h1>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-100">Welcome Back</h2>
          <p className="mt-1 text-sm text-neutral-400">Enter your credentials to continue</p>
        </div>

        <form className="mt-8 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="h-12 w-full rounded-xl border border-neutral-700/70 bg-neutral-800/80 transition-colors focus-within:border-purple-500">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="h-full w-full rounded-xl bg-transparent px-3 text-neutral-50 placeholder:text-neutral-500 focus:outline-none"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoFocus
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="relative flex h-12 w-full items-center rounded-xl border border-neutral-700/70 bg-neutral-800/80 transition-colors focus-within:border-purple-500">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="h-full w-full rounded-xl bg-transparent px-3 pr-12 text-neutral-50 placeholder:text-neutral-500 focus:outline-none"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700/60 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-neutral-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <IconEyeOff stroke={1.5} size={20} />
              ) : (
                <IconEye stroke={1.5} size={20} />
              )}
            </button>
          </div>

          <button
            className="mt-2 h-12 w-full cursor-pointer rounded-xl bg-purple-700 font-semibold text-neutral-50 transition-all hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="mt-2 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
