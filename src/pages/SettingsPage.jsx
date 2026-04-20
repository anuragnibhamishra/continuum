import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react";

function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, navigate to login
      navigate("/login");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Settings</h2>
      <p className="text-neutral-400 mb-8">Configure your preferences here</p>

      {/* User Info Section */}
      <div className="mb-8 p-6 bg-neutral-900 rounded-lg border border-neutral-800">
        <h3 className="text-xl font-semibold mb-4">Account</h3>
        {user && (
          <div className="space-y-2">
            <p className="text-neutral-300">
              <span className="text-neutral-500">Name:</span> {user.name}
            </p>
            <p className="text-neutral-300">
              <span className="text-neutral-500">Email:</span> {user.email}
            </p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-6 bg-neutral-900 rounded-lg border border-neutral-800">
        <button
          onClick={handleLogout}
          disabled={status === "loading"}
          className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconLogout stroke={1.5} />
          <span className="font-medium">
            {status === "loading" ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage
