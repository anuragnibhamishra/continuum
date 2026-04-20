import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FloatingTimerCard from "../components/FloatingTimerCard";
import { PomodoroTimerProvider } from "../features/timer/PomodoroTimerContext";

export default function AppLayout() {
  return (
    <PomodoroTimerProvider>
      <div className="w-full h-screen bg-neutral-950 text-neutral-100 font-[Satoshi] flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
        <FloatingTimerCard />
      </div>
    </PomodoroTimerProvider>
  );
}
