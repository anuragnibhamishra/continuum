import { createSlice } from "@reduxjs/toolkit";
import { selectAllHabits } from "../habits/habitsSlice";
import { selectAllTasks } from "../tasks/tasksSlice";

const STORAGE_KEY = "trackwolf_categories";

/** Stable ids so habits/tasks can reference categories across sessions. */
export const DEFAULT_CATEGORIES = [
  {
    id: "cat-quit",
    name: "Quit a bad habit",
    iconKey: "ban",
    color: "#ef4444"
  },
  {
    id: "cat-art",
    name: "Art",
    iconKey: "palette",
    color: "#f43f5e"
  },
  {
    id: "cat-meditation",
    name: "Meditation",
    iconKey: "meditation",
    color: "#d946ef"
  },
  {
    id: "cat-study",
    name: "Study",
    iconKey: "study",
    color: "#8b5cf6"
  },
  {
    id: "cat-sports",
    name: "Sports",
    iconKey: "sports",
    color: "#3b82f6"
  },
  {
    id: "cat-entertainment",
    name: "Entertainment",
    iconKey: "entertainment",
    color: "#06b6d4"
  },
  {
    id: "cat-social",
    name: "Social",
    iconKey: "social",
    color: "#14b8a6"
  },
  {
    id: "cat-finance",
    name: "Finance",
    iconKey: "finance",
    color: "#22c55e"
  },
  {
    id: "cat-health",
    name: "Health",
    iconKey: "health",
    color: "#84cc16"
  },
  {
    id: "cat-work",
    name: "Work",
    iconKey: "work",
    color: "#a3e635"
  },
  {
    id: "cat-nutrition",
    name: "Nutrition",
    iconKey: "nutrition",
    color: "#f59e0b"
  },
  {
    id: "cat-home",
    name: "Home",
    iconKey: "home",
    color: "#f97316"
  },
  {
    id: "cat-outdoor",
    name: "Outdoor",
    iconKey: "outdoor",
    color: "#ea580c"
  },
  {
    id: "cat-other",
    name: "Other",
    iconKey: "other",
    color: "#ef4444"
  }
];


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
  categories: DEFAULT_CATEGORIES,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory(state, action) {
      const { name, iconKey = "other", color = "#9c66ff" } = action.payload;
      state.categories.push({
        id: crypto.randomUUID(),
        name: name?.trim() || "New category",
        iconKey,
        color,
      });
    },
    updateCategory(state, action) {
      const { id, name, iconKey, color } = action.payload;
      const cat = state.categories.find((c) => c.id === id);
      if (!cat) return;
      if (name !== undefined) cat.name = name.trim() || cat.name;
      if (iconKey !== undefined) cat.iconKey = iconKey;
      if (color !== undefined) cat.color = color;
    },
    removeCategory(state, action) {
      const id = action.payload;
      state.categories = state.categories.filter((c) => c.id !== id);
    },
  },
});

export const { addCategory, updateCategory, removeCategory } = categoriesSlice.actions;

export function selectAllCategories(state) {
  return state.categories?.categories ?? [];
}

/** Habits and tasks per category (all tasks counted, not only incomplete). */
export function selectCategoriesWithCounts(state) {
  const categories = selectAllCategories(state);
  const habits = selectAllHabits(state);
  const tasks = selectAllTasks(state);
  return categories.map((c) => ({
    ...c,
    habitCount: habits.filter((h) => h.categoryId === c.id).length,
    taskCount: tasks.filter((t) => t.categoryId === c.id).length,
  }));
}

export default categoriesSlice.reducer;
