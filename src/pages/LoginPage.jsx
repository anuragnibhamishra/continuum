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
    <div className="w-full h-screen flex-col bg-neutral-950 flex justify-center items-center">
      <div className="w-full mb-12 h-fit flex justify-center gap-3 items-center">
          <img src="favicon.svg" className="w-10" alt="Continuum Logo" />
          <h1 className="text-3xl text-neutral-50 font-medium">Continuum</h1>
        </div>
      <div className="w-md h-fit rounded-3xl p-6 bg-neutral-900 text-neutral-50 font-[Satoshi] flex flex-col justify-center items-center tracking-tighter leading-none">
        <h1 className="text-2xl text-center">Welcome Back</h1>
        <p className="text-sm opacity-40">Enter your credentials to continue</p>

        <form
          className="w-full h-fit mt-10 flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full h-12 rounded-md bg-neutral-800">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="w-full h-full p-3 rounded-md bg-transparent text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoFocus
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="w-full h-12 rounded-md bg-neutral-800 flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="w-full h-full p-3 pr-12 rounded-md bg-transparent text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-neutral-800 rounded"
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
            className="w-full cursor-pointer hover:bg-purple-600 h-12 rounded-md mt-2 bg-purple-700 text-neutral-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div className="text-red-500 text-sm mt-2 text-center w-full">{error}</div>}
        </form>
      </div>
    </div>
  );
}
