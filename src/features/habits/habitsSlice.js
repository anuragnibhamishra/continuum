import { createSlice } from "@reduxjs/toolkit";

/**
 * Check if a habit is due on a given date based on frequency.
 * @param {Object} habit - { frequency }
 * @param {Date} date
 * @returns {boolean}
 */
export function isHabitDueOnDate(habit, date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  const dayOfMonth = d.getDate();

  switch (habit.frequency) {
    case "daily":
      return true;
    case "weekly":
      return dayOfWeek === (habit.weekday ?? 0);
    case "monthly":
      return dayOfMonth === (habit.dayOfMonth ?? 1);
    default:
      return true;
  }
}

/**
 * Get ISO date string (YYYY-MM-DD) for a Date.
 */
export function toDateKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/**
 * Compute current streak for a habit (consecutive days/weeks/months with check-ins).
 * @param {string[]} dateKeys - Sorted ISO date strings (YYYY-MM-DD)
 * @param {string} frequency - daily | weekly | monthly
 * @param {string} asOfDateKey - Optional; compute streak as of this date (default: today)
 */
export function computeStreak(dateKeys, frequency, asOfDateKey = toDateKey(new Date())) {
  if (!dateKeys || dateKeys.length === 0) return 0;

  const sorted = [...dateKeys].sort();
  const asOf = new Date(asOfDateKey);
  asOf.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = asOf;

  if (frequency === "daily") {
    const key = toDateKey(cursor);
    if (!sorted.includes(key)) {
      // Streak is 0 if today not checked
      const yesterday = new Date(cursor);
      yesterday.setDate(yesterday.getDate() - 1);
      cursor = yesterday;
    }
    while (cursor.getTime() >= new Date(sorted[0]).getTime()) {
      const key = toDateKey(cursor);
      if (sorted.includes(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  } else if (frequency === "weekly") {
    const weekStart = (d) => {
      const x = new Date(d);
      const day = x.getDay();
      x.setDate(x.getDate() - day);
      x.setHours(0, 0, 0, 0);
      return x;
    };
    let week = weekStart(cursor);
    const weekKey = toDateKey(week);
    const hasThisWeek = sorted.some((k) => {
      const w = weekStart(new Date(k));
      return toDateKey(w) === weekKey;
    });
    if (!hasThisWeek) {
      week.setDate(week.getDate() - 7);
    }
    while (week.getTime() >= weekStart(new Date(sorted[0])).getTime()) {
      const hasWeek = sorted.some((k) => toDateKey(weekStart(new Date(k))) === toDateKey(week));
      if (hasWeek) {
        streak++;
        week.setDate(week.getDate() - 7);
      } else {
        break;
      }
    }
  } else {
    // monthly: count consecutive months with at least one check-in
    const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    let month = monthKey(cursor);
    const hasThisMonth = sorted.some((k) => monthKey(new Date(k)) === month);
    if (!hasThisMonth) {
      cursor.setMonth(cursor.getMonth() - 1);
      month = monthKey(cursor);
    }
    const firstMonth = monthKey(new Date(sorted[0]));
    while (month >= firstMonth) {
      const hasMonth = sorted.some((k) => monthKey(new Date(k)) === month);
      if (hasMonth) {
        streak++;
        cursor.setMonth(cursor.getMonth() - 1);
        month = monthKey(cursor);
      } else {
        break;
      }
    }
  }

  return streak;
}

const STORAGE_KEY = "trackwolf_habits";

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
  habits: [],
  checkIns: {},
};

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    addHabit(state, action) {
      const {
        id,
        title,
        description = "",
        frequency,
        goalCount = 1,
        categoryId = null,
        color = null,
        weekday = null,
        dayOfMonth = null,
      } = action.payload;
      state.habits.push({
        id: id ?? crypto.randomUUID(),
        title,
        description,
        frequency: frequency ?? "daily",
        goalCount: goalCount ?? 1,
        categoryId,
        color,
        weekday: frequency === "weekly" ? (weekday ?? 0) : undefined,
        dayOfMonth: frequency === "monthly" ? (dayOfMonth ?? 1) : undefined,
        createdAt: new Date().toISOString(),
      });
    },
    updateHabit(state, action) {
      const { id, ...updates } = action.payload;
      const habit = state.habits.find((h) => h.id === id);
      if (habit) {
        Object.assign(habit, updates);
      }
    },
    removeHabit(state, action) {
      const id = action.payload;
      state.habits = state.habits.filter((h) => h.id !== id);
      delete state.checkIns[id];
    },
    checkIn(state, action) {
      const { habitId, dateKey } = action.payload;
      if (!state.checkIns[habitId]) state.checkIns[habitId] = [];
      if (!state.checkIns[habitId].includes(dateKey)) {
        state.checkIns[habitId].push(dateKey);
      }
    },
    uncheck(state, action) {
      const { habitId, dateKey } = action.payload;
      if (state.checkIns[habitId]) {
        state.checkIns[habitId] = state.checkIns[habitId].filter((d) => d !== dateKey);
      }
    },
  },
});

export const { addHabit, updateHabit, removeHabit, checkIn, uncheck } = habitsSlice.actions;

export function selectAllHabits(state) {
  return state.habits?.habits ?? [];
}

export function selectCheckIns(state) {
  return state.habits?.checkIns ?? {};
}

export function selectHabitsDueOnDate(state, date) {
  const habits = selectAllHabits(state);
  return habits.filter((h) => isHabitDueOnDate(h, date));
}

export function selectIsCheckedIn(state, habitId, dateKey) {
  const checkIns = selectCheckIns(state);
  return (checkIns[habitId] ?? []).includes(dateKey);
}

export default habitsSlice.reducer;
