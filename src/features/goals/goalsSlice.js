import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "trackwolf_goals";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

const initialState = loadFromStorage() ?? {
  weeklyHabitTarget: 5,
  dailyPomodoroTarget: 4,
  weeklyTaskTarget: 10,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setGoals(state, action) {
      Object.assign(state, action.payload);
    },
    setWeeklyHabitTarget(state, action) {
      state.weeklyHabitTarget = action.payload;
    },
    setDailyPomodoroTarget(state, action) {
      state.dailyPomodoroTarget = action.payload;
    },
    setWeeklyTaskTarget(state, action) {
      state.weeklyTaskTarget = action.payload;
    },
  },
});

export const {
  setGoals,
  setWeeklyHabitTarget,
  setDailyPomodoroTarget,
  setWeeklyTaskTarget,
} = goalsSlice.actions;

export function selectGoals(state) {
  return state.goals ?? initialState;
}

export default goalsSlice.reducer;
