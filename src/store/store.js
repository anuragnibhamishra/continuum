import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import habitsReducer from "../features/habits/habitsSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import timerReducer from "../features/timer/timerSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import goalsReducer from "../features/goals/goalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    tasks: tasksReducer,
    timer: timerReducer,
    categories: categoriesReducer,
    goals: goalsReducer,
  },
});

const PERSIST_KEYS = {
  habits: "trackwolf_habits",
  tasks: "trackwolf_tasks",
  timer: "trackwolf_timer",
  categories: "trackwolf_categories",
  goals: "trackwolf_goals",
};

let persistTimeout = null;

store.subscribe(() => {
  if (persistTimeout) clearTimeout(persistTimeout);

  persistTimeout = setTimeout(() => {
    const state = store.getState();
    try {
      for (const [slice, key] of Object.entries(PERSIST_KEYS)) {
        if (state[slice]) {
          localStorage.setItem(key, JSON.stringify(state[slice]));
        }
      }
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  }, 300);
});
