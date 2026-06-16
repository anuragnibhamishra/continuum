import { describe, it, expect } from "vitest";
import tasksReducer, {
  isTaskDueOnDate,
  completeTask,
  addTask,
} from "../features/tasks/tasksSlice";
import { toDateKey } from "../features/habits/habitsSlice";

function localDate(year, month, day) {
  return new Date(year, month - 1, day);
}

describe("isTaskDueOnDate", () => {
  it("matches one-off tasks on exact due date", () => {
    const dueKey = toDateKey(localDate(2026, 6, 14));
    const task = { dueDate: dueKey, recurring: "none", completed: false };
    expect(isTaskDueOnDate(task, localDate(2026, 6, 14))).toBe(true);
    expect(isTaskDueOnDate(task, localDate(2026, 6, 15))).toBe(false);
  });

  it("excludes completed one-off tasks", () => {
    const dueKey = toDateKey(localDate(2026, 6, 14));
    const task = { dueDate: dueKey, recurring: "none", completed: true };
    expect(isTaskDueOnDate(task, localDate(2026, 6, 14))).toBe(false);
  });

  it("matches daily recurring tasks on any day", () => {
    const task = {
      dueDate: toDateKey(localDate(2026, 6, 1)),
      recurring: "daily",
      completed: false,
    };
    expect(isTaskDueOnDate(task, localDate(2026, 6, 14))).toBe(true);
  });

  it("matches weekly recurring tasks on same weekday as due date", () => {
    const due = localDate(2026, 6, 14);
    const task = { dueDate: toDateKey(due), recurring: "weekly", completed: false };
    expect(isTaskDueOnDate(task, localDate(2026, 6, 21))).toBe(true);
    expect(isTaskDueOnDate(task, localDate(2026, 6, 15))).toBe(false);
  });
});

describe("completeTask recurring behavior", () => {
  it("advances due date for recurring tasks instead of staying completed", () => {
    const dueKey = toDateKey(localDate(2026, 6, 14));
    const nextKey = toDateKey(localDate(2026, 6, 15));
    let state = { tasks: [] };
    state = tasksReducer(
      state,
      addTask({
        id: "t1",
        title: "Daily task",
        dueDate: dueKey,
        recurring: "daily",
      })
    );
    state = tasksReducer(state, completeTask("t1"));
    const task = state.tasks[0];
    expect(task.completed).toBe(false);
    expect(task.dueDate).toBe(nextKey);
  });

  it("marks one-off tasks as completed", () => {
    const dueKey = toDateKey(localDate(2026, 6, 14));
    let state = { tasks: [] };
    state = tasksReducer(
      state,
      addTask({
        id: "t2",
        title: "Once",
        dueDate: dueKey,
        recurring: "none",
      })
    );
    state = tasksReducer(state, completeTask("t2"));
    expect(state.tasks[0].completed).toBe(true);
    expect(state.tasks[0].completedAt).toBeTruthy();
  });
});
