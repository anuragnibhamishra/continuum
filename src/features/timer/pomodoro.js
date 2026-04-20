import { MODES, TOTAL_LOOPS } from "./constants";

/**
 * @param {"focus" | "break"} state
 * @param {number} session - Increments after each completed focus block
 * @param {keyof typeof MODES} presetKey
 */
export function getDurationSeconds(state, session, presetKey) {
  const config = MODES[presetKey];
  if (state === "focus") return config.focus * 60;
  return (session % 3 === 0 ? config.long : config.short) * 60;
}

export function getBreakKind(session) {
  return session % 3 === 0 ? "long" : "short";
}

export function nextLoopValue(prevLoop, nextSession) {
  if (nextSession % 3 === 0 && prevLoop < TOTAL_LOOPS) return prevLoop + 1;
  return prevLoop;
}
