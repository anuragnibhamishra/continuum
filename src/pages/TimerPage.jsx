import { useSelector } from "react-redux";
import {
  IconBolt,
  IconClock,
  IconCoffee,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotateClockwise,
  IconVolume,
  IconVolumeOff,
  IconBeach,
} from "@tabler/icons-react";
import { MODES, PRESET_ORDER, TOTAL_LOOPS } from "../features/timer/constants";
import { selectTimerStats } from "../features/timer/timerSlice";
import { usePomodoroTimerContext } from "../features/timer/PomodoroTimerContext";

const R = 110;
const C = 2 * Math.PI * R;

function TimerPage() {
  const { pomodorosToday, totalPomodoros } = useSelector(selectTimerStats);
  const {
    mode,
    timer,
    isRunning,
    hasStarted,
    soundOn,
    setSoundOn,
    phaseInfo,
    progress,
    timeLabel,
    handleModeChange,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    skipBreak,
  } = usePomodoroTimerContext();

  const preset = MODES[mode];
  const canChangePreset = !isRunning && !hasStarted;
  const onBreak = timer.state === "break";

  return (
    <div className="h-full flex flex-col gap-8 w-full mx-auto">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#A78BFA] mb-2">Productivity</div>
          <h1 className="text-3xl font-semibold text-neutral-100 tracking-tight">Pomodoro timer</h1>
          <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
            Focus blocks, short pauses, and long resets—three focus rounds per cycle, up to {TOTAL_LOOPS} cycles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-sm text-neutral-300">
            <span className="text-neutral-500">Today</span>{" "}
            <span className="font-semibold text-[#C4B5FD] tabular-nums">{pomodorosToday}</span>
            <span className="text-neutral-600 mx-2">·</span>
            <span className="text-neutral-500">All time</span>{" "}
            <span className="font-medium text-neutral-200 tabular-nums">{totalPomodoros}</span>
          </div>
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
              soundOn
                ? "border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#E9D5FF] hover:bg-[#7C3AED]/20"
                : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
            }`}
            aria-pressed={soundOn}
            title={soundOn ? "Mute phase chime" : "Unmute phase chime"}
          >
            {soundOn ? <IconVolume stroke={1.5} size={18} /> : <IconVolumeOff stroke={1.5} size={18} />}
            Sound
          </button>
        </div>
      </header>

      <section aria-label="Preset lengths">
        <h2 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
          <IconClock stroke={1.5} size={20} />
          Preset
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESET_ORDER.map((key) => {
            const active = mode === key;
            const cfg = MODES[key];
            return (
              <button
                key={key}
                type="button"
                disabled={!canChangePreset}
                onClick={() => handleModeChange(key)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "border-[#7C3AED] bg-[#7C3AED]/15 text-[#F5F3FF] shadow-lg shadow-[#7C3AED]/10"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <span className="block text-left">{cfg.label}</span>
                <span className="block text-xs font-normal text-neutral-500 mt-0.5">
                  {cfg.focus}/{cfg.short}/{cfg.long} min
                </span>
              </button>
            );
          })}
        </div>
        {!canChangePreset && (
          <p className="text-xs text-neutral-600 mt-2">Pause and reset to change preset lengths.</p>
        )}
      </section>

      <section
        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 sm:p-10 shadow-xl shadow-black/30"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 text-sm font-medium">
            {timer.state === "focus" ? (
              <IconBolt stroke={1.5} className={phaseInfo.accent} size={20} />
            ) : phaseInfo.kind === "longBreak" ? (
              <IconBeach stroke={1.5} className={phaseInfo.accent} size={20} />
            ) : (
              <IconCoffee stroke={1.5} className={phaseInfo.accent} size={20} />
            )}
            <span className={phaseInfo.accent}>{phaseInfo.title}</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400">{preset.label} rhythm</span>
          </div>

          <div className="relative grid place-items-center">
            <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 280 280" aria-hidden>
              <circle cx="140" cy="140" r={R} fill="none" strokeWidth="10" className="text-neutral-800" stroke="currentColor" />
              <circle
                cx="140"
                cy="140"
                r={R}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                stroke="currentColor"
                className={phaseInfo.ring}
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="text-4xl sm:text-5xl font-semibold tabular-nums tracking-tight text-neutral-50">
                {timeLabel}
              </div>
              <p className="text-sm text-neutral-500 mt-2 max-w-56">{phaseInfo.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            {!hasStarted && (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/25"
              >
                <IconPlayerPlay stroke={1.5} size={20} />
                Start focus
              </button>
            )}

            {hasStarted && isRunning && (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-6 py-3 text-sm font-semibold text-neutral-100 hover:bg-neutral-700"
              >
                <IconPlayerPause stroke={1.5} size={20} />
                Pause
              </button>
            )}

            {hasStarted && !isRunning && (
              <>
                <button
                  type="button"
                  onClick={handleResume}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/25"
                >
                  <IconPlayerPlay stroke={1.5} size={20} />
                  Resume
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  <IconRotateClockwise stroke={1.5} size={20} />
                  Reset
                </button>
              </>
            )}
          </div>

          {hasStarted && onBreak && (
            <button
              type="button"
              onClick={skipBreak}
              className="inline-flex items-center gap-2 text-sm text-emerald-400/90 hover:text-emerald-300"
            >
              <IconPlayerSkipForward stroke={1.5} size={18} />
              Skip break
            </button>
          )}

          <p className="text-xs text-neutral-600 text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[11px]">Space</kbd>{" "}
            to start or pause
          </p>
        </div>
      </section>
    </div>
  );
}

export default TimerPage;
