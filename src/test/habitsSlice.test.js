import { describe, it, expect } from "vitest";
import {
  isHabitDueOnDate,
  computeStreak,
  toDateKey,
} from "../features/habits/habitsSlice";

function localDate(year, month, day) {
  return new Date(year, month - 1, day);
}

describe("isHabitDueOnDate", () => {
  it("returns true for daily habits on any day", () => {
    const habit = { frequency: "daily" };
    expect(isHabitDueOnDate(habit, localDate(2026, 6, 14))).toBe(true);
    expect(isHabitDueOnDate(habit, localDate(2026, 1, 1))).toBe(true);
  });

  it("returns true for weekly habits only on configured weekday", () => {
    const sunday = localDate(2026, 6, 14);
    const habit = { frequency: "weekly", weekday: sunday.getDay() };
    expect(isHabitDueOnDate(habit, sunday)).toBe(true);
    expect(isHabitDueOnDate(habit, localDate(2026, 6, 15))).toBe(false);
  });

  it("returns true for monthly habits only on configured day of month", () => {
    const habit = { frequency: "monthly", dayOfMonth: 14 };
    expect(isHabitDueOnDate(habit, localDate(2026, 6, 14))).toBe(true);
    expect(isHabitDueOnDate(habit, localDate(2026, 6, 15))).toBe(false);
  });
});

describe("computeStreak", () => {
  it("counts consecutive daily check-ins ending today", () => {
    const dates = [
      toDateKey(localDate(2026, 6, 12)),
      toDateKey(localDate(2026, 6, 13)),
      toDateKey(localDate(2026, 6, 14)),
    ];
    expect(computeStreak(dates, "daily", toDateKey(localDate(2026, 6, 14)))).toBe(3);
  });

  it("returns 0 when today is not checked and yesterday is not checked", () => {
    const dates = [
      toDateKey(localDate(2026, 6, 10)),
      toDateKey(localDate(2026, 6, 11)),
    ];
    expect(computeStreak(dates, "daily", toDateKey(localDate(2026, 6, 14)))).toBe(0);
  });

  it("counts from yesterday when today is not checked", () => {
    const dates = [
      toDateKey(localDate(2026, 6, 12)),
      toDateKey(localDate(2026, 6, 13)),
    ];
    expect(computeStreak(dates, "daily", toDateKey(localDate(2026, 6, 14)))).toBe(2);
  });
});

describe("toDateKey", () => {
  it("returns YYYY-MM-DD format", () => {
    const key = toDateKey(localDate(2026, 6, 14));
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
