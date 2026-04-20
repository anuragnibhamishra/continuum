import { createSlice } from "@reduxjs/toolkit";

function toDateKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/**
 * Check if a task is due on a given date (for one-off: exact match; for recurring: rule matches).
 */
export function isTaskDueOnDate(task, date) {
  const dateKey = toDateKey(date);
  if (task.completed) return false;

  if (!task.recurring || task.recurring === "none") {
    return task.dueDate === dateKey;
  }

  const d = new Date(date);
  const due = task.dueDate ? new Date(task.dueDate) : new Date();

  if (task.recurring === "daily") return true;
  if (task.recurring === "weekly") return d.getDay() === due.getDay();
  if (task.recurring === "monthly") return d.getDate() === due.getDate();
  return task.dueDate === dateKey;
}

const STORAGE_KEY = "trackwolf_tasks";

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
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action) {
      const { id, title, description = "", dueDate, dueTime, recurring = "none", categoryId = null } =
        action.payload;
      state.tasks.push({
        id: id ?? crypto.randomUUID(),
        title,
        description,
        dueDate: dueDate ?? toDateKey(new Date()),
        dueTime: dueTime ?? null,
        recurring: recurring ?? "none",
        completed: false,
        completedAt: null,
        categoryId,
        createdAt: new Date().toISOString(),
      });
    },
    updateTask(state, action) {
      const { id, ...updates } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        Object.assign(task, updates);
      }
    },
    removeTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    completeTask(state, action) {
      const id = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        if (task.recurring && task.recurring !== "none") {
          const next = new Date(task.dueDate);
          if (task.recurring === "daily") next.setDate(next.getDate() + 1);
          else if (task.recurring === "weekly") next.setDate(next.getDate() + 7);
          else if (task.recurring === "monthly") next.setMonth(next.getMonth() + 1);
          task.dueDate = toDateKey(next);
          task.completed = false;
          task.completedAt = null;
        }
      }
    },
    uncompleteTask(state, action) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = false;
        task.completedAt = null;
      }
    },
  },
});

export const { addTask, updateTask, removeTask, completeTask, uncompleteTask } = tasksSlice.actions;

export function selectAllTasks(state) {
  return state.tasks?.tasks ?? [];
}

export function selectTasksDueOnDate(state, date) {
  const tasks = selectAllTasks(state);
  return tasks.filter((t) => isTaskDueOnDate(t, date));
}

export default tasksSlice.reducer;
