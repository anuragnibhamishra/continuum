import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IconChartBar, IconCheckbox, IconFlame, IconRepeat } from "@tabler/icons-react";
import { selectAllHabits, selectCheckIns, toDateKey, isHabitDueOnDate } from "../features/habits/habitsSlice";
import { selectAllTasks } from "../features/tasks/tasksSlice";
import { selectTimerStats } from "../features/timer/timerSlice";

function getLastNDays(n) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function computeHabitCompletionRate(habits, checkIns, days) {
  let due = 0;
  let completed = 0;

  for (const date of days) {
    const dateKey = toDateKey(date);
    for (const habit of habits) {
      if (!isHabitDueOnDate(habit, date)) continue;
      due++;
      const entry = checkIns[habit.id];
      const status = Array.isArray(entry)
        ? entry.includes(dateKey)
          ? "success"
          : "not_checked"
        : entry?.[dateKey];
      if (status === "success") completed++;
    }
  }

  return due > 0 ? Math.round((completed / due) * 100) : 0;
}

function StatCard({ icon, label, value, sub }) {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-3 flex items-center gap-2 text-[#A78BFA]">
        <Icon size={20} stroke={1.5} />
        <span className="text-sm font-medium text-neutral-400">{label}</span>
      </div>
      <p className="text-3xl font-semibold tabular-nums text-neutral-100">{value}</p>
      {sub ? <p className="mt-1 text-xs text-neutral-500">{sub}</p> : null}
    </div>
  );
}

function AnalyticsPage() {
  const habits = useSelector(selectAllHabits);
  const checkIns = useSelector(selectCheckIns);
  const tasks = useSelector(selectAllTasks);
  const { pomodorosToday, totalPomodoros } = useSelector(selectTimerStats);

  const stats = useMemo(() => {
    const last7 = getLastNDays(7);
    const last30 = getLastNDays(30);

    const habitRate7 = computeHabitCompletionRate(habits, checkIns, last7);
    const habitRate30 = computeHabitCompletionRate(habits, checkIns, last30);

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;

    return { habitRate7, habitRate30, completedTasks, totalTasks };
  }, [habits, checkIns, tasks]);

  return (
    <div className="flex h-full flex-col gap-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-100">Analytics</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Read-only summaries from your habits, tasks, and timer activity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={IconRepeat}
          label="Habit completion (7 days)"
          value={`${stats.habitRate7}%`}
          sub={`${habits.length} active habits`}
        />
        <StatCard
          icon={IconFlame}
          label="Habit completion (30 days)"
          value={`${stats.habitRate30}%`}
        />
        <StatCard
          icon={IconChartBar}
          label="Pomodoros today"
          value={pomodorosToday}
          sub={`${totalPomodoros} all time`}
        />
        <StatCard
          icon={IconCheckbox}
          label="Tasks completed"
          value={stats.completedTasks}
          sub={`${stats.totalTasks} total tasks`}
        />
      </div>
    </div>
  );
}

export default AnalyticsPage;
