import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { isMockAuthEnabled } from "../features/auth/authMock";
import { useNavigate } from "react-router-dom";
import {
  IconDownload,
  IconLogout,
  IconRefresh,
  IconUpload,
} from "@tabler/icons-react";
import {
  downloadLocalDataExport,
  importLocalData,
  resetLocalData,
} from "../features/data/localData";

function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, status } = useSelector((state) => state.auth);
  const [dataMessage, setDataMessage] = useState(null);
  const mockAuth = isMockAuthEnabled();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const handleExport = () => {
    downloadLocalDataExport();
    setDataMessage("Backup downloaded.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const replace = window.confirm(
        "Replace all local data with this backup? Cancel to merge missing sections only."
      );
      importLocalData(data, { replace });
      setDataMessage("Data imported. Reloading…");
      window.location.reload();
    } catch (err) {
      setDataMessage(err.message || "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Delete all habits, tasks, timer stats, categories, and goals from this browser? This cannot be undone."
      )
    ) {
      return;
    }
    resetLocalData();
    setDataMessage("Local data cleared. Reloading…");
    window.location.reload();
  };

  return (
    <div className="h-full">
      <header className="mb-8">
        <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[#A78BFA]">Preferences</div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">Settings</h1>
        <p className="mt-2 text-sm text-neutral-500">Account, data backup, and session controls.</p>
      </header>

      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="mb-4 text-xl font-semibold">Account</h3>
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
        <p className="mt-4 text-xs text-neutral-500">
          Auth mode:{" "}
          <span className={mockAuth ? "text-amber-400" : "text-emerald-400"}>
            {mockAuth ? "Local mock auth (dev)" : "API backend"}
          </span>
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="mb-2 text-xl font-semibold">Data</h3>
        <p className="mb-4 text-sm text-neutral-500">
          Export, import, or reset habits, tasks, timer stats, categories, and goals stored in this
          browser.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
          >
            <IconDownload stroke={1.5} size={18} />
            Export backup
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
          >
            <IconUpload stroke={1.5} size={18} />
            Import backup
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-950/70"
          >
            <IconRefresh stroke={1.5} size={18} />
            Reset local data
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFile}
        />
        {dataMessage && <p className="mt-3 text-sm text-neutral-400">{dataMessage}</p>}
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={status === "loading"}
          className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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

export default SettingsPage;
