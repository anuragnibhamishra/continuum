import { NavLink, useLocation } from "react-router-dom";
import {
  IconBolt,
  IconCoffee,
  IconExternalLink,
  IconPlayerPause,
  IconPlayerPlay,
  IconBeach,
} from "@tabler/icons-react";
import { MODES } from "../features/timer/constants";
import { usePomodoroTimerContext } from "../features/timer/PomodoroTimerContext";

const R = 36;
const C = 2 * Math.PI * R;

export default function FloatingTimerCard() {
  const { pathname } = useLocation();
  const {
    mode,
    timer,
    isRunning,
    hasStarted,
    phaseInfo,
    progress,
    timeLabel,
    handlePause,
    handleResume,
  } = usePomodoroTimerContext();

  if (pathname === "/timer" || !hasStarted) return null;

  const preset = MODES[mode];

  return (
    <div
      className="fixed top-8 right-8 z-60 w w-fit rounded-2xl border border-neutral-800 bg-neutral-900/95 backdrop-blur-md shadow-2xl shadow-black/40 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 grid place-items-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80" aria-hidden>
            <circle cx="40" cy="40" r={R} fill="none" strokeWidth="5" className="text-neutral-800" stroke="currentColor" />
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              stroke="currentColor"
              className={phaseInfo.ring}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-lg font-semibold tabular-nums text-neutral-50">{timeLabel}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
            {timer.state === "focus" ? (
              <IconBolt stroke={1.5} className={phaseInfo.accent} size={16} />
            ) : phaseInfo.kind === "longBreak" ? (
              <IconBeach stroke={1.5} className={phaseInfo.accent} size={16} />
            ) : (
              <IconCoffee stroke={1.5} className={phaseInfo.accent} size={16} />
            )}
            <span className={phaseInfo.accent}>{phaseInfo.title}</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{preset.label} · {phaseInfo.subtitle}</p>

          <div className="flex f items-center gap-2 mt-3">
            {isRunning ? (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-100 hover:bg-neutral-700"
              >
                <IconPlayerPause stroke={1.5} size={16} />
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResume}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#6D28D9]"
              >
                <IconPlayerPlay stroke={1.5} size={16} />
                Resume
              </button>
            )}
            <NavLink
              to="/timer"
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
            >
              <IconExternalLink stroke={1.5} size={14} />
              Open timer
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
