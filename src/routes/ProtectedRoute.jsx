import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, status, isInitialized } = useSelector((state) => state.auth);

  // Show loading state while initializing or checking authentication
  if (!isInitialized || status === "loading") {
    return (
      <div className="w-full h-screen bg-neutral-950 flex justify-center items-center">
        <div className="text-neutral-400">Checking authentication...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
  