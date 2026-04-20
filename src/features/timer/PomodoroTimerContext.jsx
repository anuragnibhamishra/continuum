import { createContext, useContext } from "react";
import { usePomodoroTimer } from "./usePomodoroTimer";

const PomodoroTimerContext = createContext(null);

export function PomodoroTimerProvider({ children }) {
  const value = usePomodoroTimer();
  return <PomodoroTimerContext.Provider value={value}>{children}</PomodoroTimerContext.Provider>;
}

export function usePomodoroTimerContext() {
  const ctx = useContext(PomodoroTimerContext);
  if (!ctx) {
    throw new Error("usePomodoroTimerContext must be used within PomodoroTimerProvider");
  }
  return ctx;
}
