import { createSlice } from "@reduxjs/toolkit";
import { toDateKey } from "../habits/habitsSlice";

const STORAGE_KEY = "trackwolf_timer";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const today = toDateKey(new Date());
    if (parsed.statsDateKey && parsed.statsDateKey !== today) {
      return { ...parsed, statsDateKey: today, pomodorosToday: 0 };
    }
    if (!parsed.statsDateKey) {
      return { ...parsed, statsDateKey: today, pomodorosToday: parsed.pomodorosToday ?? 0 };
    }
    return parsed;
  } catch {
    return undefined;
  }
}

const defaults = {
  preset: "long",
  statsDateKey: toDateKey(new Date()),
  pomodorosToday: 0,
  totalPomodoros: 0,
};

const loaded = loadFromStorage();
const initialState = loaded ? { ...defaults, ...loaded } : defaults;

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setPreset(state, action) {
      const key = action.payload;
      if (key === "long" || key === "medium" || key === "short") {
        state.preset = key;
      }
    },
    recordPomodoroComplete(state) {
      const today = toDateKey(new Date());
      if (state.statsDateKey !== today) {
        state.statsDateKey = today;
        state.pomodorosToday = 1;
      } else {
        state.pomodorosToday += 1;
      }
      state.totalPomodoros += 1;
    },
  },
});

export const { setPreset, recordPomodoroComplete } = timerSlice.actions;

export function selectTimerStats(state) {
  const t = state.timer ?? {};
  return {
    preset: t.preset ?? "long",
    pomodorosToday: t.pomodorosToday ?? 0,
    totalPomodoros: t.totalPomodoros ?? 0,
  };
}

export default timerSlice.reducer;
