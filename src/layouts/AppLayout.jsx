import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { IconSettings, IconX } from "@tabler/icons-react";
import Sidebar, { menuItems } from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import FloatingTimerCard from "../components/FloatingTimerCard";
import { PomodoroTimerProvider } from "../features/timer/PomodoroTimerContext";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <PomodoroTimerProvider>
      <div className="w-full h-screen bg-neutral-950 text-neutral-100 font-[Satoshi] flex">
        <Sidebar className="hidden md:flex" />

        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <aside className="fixed left-0 top-0 z-50 h-full w-72 border-r border-neutral-800 bg-neutral-900 p-4 md:hidden">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                  aria-label="Close menu"
                >
                  <IconX stroke={1.8} size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                        isActive
                          ? "bg-neutral-800/80 text-purple-500"
                          : "text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}

                <NavLink
                  to="/settings"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `mt-3 flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-neutral-800/80 text-purple-500"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
                    }`
                  }
                >
                  <span className="text-xl">
                    <IconSettings stroke={1.5} />
                  </span>
                  <span className="font-medium">Settings</span>
                </NavLink>
              </nav>
            </aside>
          </>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 pb-24 md:p-8 md:pb-8">
            <Outlet context={{ openMobileMenu }} />
          </div>
        </main>

        <MobileBottomNav />
        <FloatingTimerCard />
      </div>
    </PomodoroTimerProvider>
  );
}
