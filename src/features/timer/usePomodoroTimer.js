import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TOTAL_LOOPS } from "./constants";
import { getBreakKind, getDurationSeconds, nextLoopValue } from "./pomodoro";
import { recordPomodoroComplete, selectTimerStats, setPreset } from "./timerSlice";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playPhaseChime() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    o.type = "sine";
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.35);
    ctx.resume();
  } catch {
    /* ignore */
  }
}

/**
 * Full Pomodoro session machine: focus ↔ breaks (short/long), presets, skip break.
 */
export function usePomodoroTimer() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { preset: storedPreset } = useSelector(selectTimerStats);

  const [mode, setModeState] = useState(storedPreset);
  const [timer, setTimer] = useState(() => ({
    state: "focus",
    session: 0,
    loop: 1,
    time: getDurationSeconds("focus", 0, storedPreset),
  }));

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const recordedFocusSession = useRef(-1);

  const applyPreset = useCallback(
    (key) => {
      dispatch(setPreset(key));
      setModeState(key);
      setTimer((prev) => ({
        ...prev,
        time: getDurationSeconds(prev.state, prev.session, key),
      }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimer((prev) => ({ ...prev, time: Math.max(prev.time - 1, 0) }));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || timer.time > 0) return;

    if (soundOn) playPhaseChime();

    setTimer((prev) => {
      if (prev.state === "focus") {
        if (recordedFocusSession.current !== prev.session) {
          recordedFocusSession.current = prev.session;
          dispatch(recordPomodoroComplete());
        }
        const nextSession = prev.session + 1;
        const nextLoop = nextLoopValue(prev.loop, nextSession);
        return {
          state: "break",
          session: nextSession,
          loop: nextLoop,
          time: getDurationSeconds("break", nextSession, modeRef.current),
        };
      }

      return {
        ...prev,
        state: "focus",
        time: getDurationSeconds("focus", prev.session, modeRef.current),
      };
    });
  }, [timer.time, isRunning, dispatch, soundOn]);

  const handleModeChange = (key) => {
    if (isRunning || hasStarted) return;
    applyPreset(key);
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleResume = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasStarted(false);
    recordedFocusSession.current = -1;
    setTimer({
      state: "focus",
      session: 0,
      loop: 1,
      time: getDurationSeconds("focus", 0, modeRef.current),
    });
  };

  const skipBreak = () => {
    if (timer.state !== "break" || !hasStarted) return;
    if (soundOn) playPhaseChime();
    setTimer((prev) => ({
      ...prev,
      state: "focus",
      time: getDurationSeconds("focus", prev.session, modeRef.current),
    }));
    setIsRunning(true);
  };

  const phaseInfo = useMemo(() => {
    const isFocus = timer.state === "focus";
    if (isFocus) {
      const focusBlock = (timer.session % 3) + 1;
      return {
        kind: "focus",
        title: "Focus",
        subtitle: `Block ${focusBlock} of 3 · Cycle ${timer.loop} of ${TOTAL_LOOPS}`,
        accent: "text-[#C4B5FD]",
        ring: "stroke-[#7C3AED]",
      };
    }
    const bk = getBreakKind(timer.session);
    const isLong = bk === "long";
    return {
      kind: isLong ? "longBreak" : "shortBreak",
      title: isLong ? "Long break" : "Short break",
      subtitle: isLong ? "Recharge before the next round" : "Step away and breathe",
      accent: "text-emerald-300/90",
      ring: isLong ? "stroke-emerald-400" : "stroke-teal-400",
    };
  }, [timer.state, timer.session, timer.loop]);

  const phaseTotal = getDurationSeconds(timer.state, timer.session, mode);
  const progress = phaseTotal > 0 ? timer.time / phaseTotal : 0;

  const timeLabel = formatTime(timer.time);

  useEffect(() => {
    const phase =
      timer.state === "focus"
        ? "Focus"
        : getBreakKind(timer.session) === "long"
          ? "Long break"
          : "Short break";
    document.title = `${timeLabel} · ${phase} · Continuum`;
    return () => {
      document.title = "Continuum";
    };
  }, [timeLabel, timer.state, timer.session]);

  const controlsRef = useRef({});
  controlsRef.current = { hasStarted, isRunning, handleStart, handlePause, handleResume };

  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" && e.key !== " ") return;
      if (pathname !== "/timer") return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      e.preventDefault();
      const { hasStarted: started, isRunning: running, handleStart: start, handlePause: pause, handleResume: resume } =
        controlsRef.current;
      if (!started) start();
      else if (running) pause();
      else resume();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  return {
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
  };
}
