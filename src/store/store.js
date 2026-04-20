import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import habitsReducer from "../features/habits/habitsSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import timerReducer from "../features/timer/timerSlice";
import categoriesReducer from "../features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    tasks: tasksReducer,
    timer: timerReducer,
    categories: categoriesReducer,
  },
});

// Persist habits and tasks to localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  try {
    if (state.habits) {
      localStorage.setItem("trackwolf_habits", JSON.stringify(state.habits));
    }
    if (state.tasks) {
      localStorage.setItem("trackwolf_tasks", JSON.stringify(state.tasks));
    }
    if (state.timer) {
      localStorage.setItem("trackwolf_timer", JSON.stringify(state.timer));
    }
    if (state.categories) {
      localStorage.setItem("trackwolf_categories", JSON.stringify(state.categories));
    }
  } catch (e) {
    console.warn("Failed to persist habits/tasks", e);
  }
});
