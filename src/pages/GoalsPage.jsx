import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBolt, IconCheckbox, IconRepeat } from "@tabler/icons-react";
import {
  selectAllHabits,
  selectCheckIns,
  toDateKey,
  isHabitDueOnDate,
} from "../features/habits/habitsSlice";
import { selectAllTasks } from "../features/tasks/tasksSlice";
import { selectTimerStats } from "../features/timer/timerSlice";
import {
  selectGoals,
  setWeeklyHabitTarget,
  setDailyPomodoroTarget,
  setWeeklyTaskTarget,
} from "../features/goals/goalsSlice";

function getWeekStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function GoalCard({ icon, label, current, target, onTargetChange, unit }) {
  const Icon = icon;
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={20} stroke={1.5} className="text-[#A78BFA]" />
        <span className="font-medium text-neutral-200">{label}</span>
      </div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums text-neutral-100">{current}</span>
        <span className="text-neutral-500">/ {target} {unit}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-[#7C3AED] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-400">
        Target:
        <input
          type="number"
          min={1}
          max={999}
          value={target}
          onChange={(e) => onTargetChange(Number(e.target.value) || 1)}
          className="w-20 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-100"
        />
      </label>
    </div>
  );
}

function GoalsPage() {
  const dispatch = useDispatch();
  const goals = useSelector(selectGoals);
  const habits = useSelector(selectAllHabits);
  const checkIns = useSelector(selectCheckIns);
  const tasks = useSelector(selectAllTasks);
  const { pomodorosToday } = useSelector(selectTimerStats);

  const progress = useMemo(() => {
    const weekStart = getWeekStart();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      if (d > new Date()) break;
      weekDates.push(d);
    }

    let habitCheckInsThisWeek = 0;
    for (const date of weekDates) {
      const dateKey = toDateKey(date);
      for (const habit of habits) {
        if (!isHabitDueOnDate(habit, date)) continue;
        const entry = checkIns[habit.id];
        const ok = Array.isArray(entry)
          ? entry.includes(dateKey)
          : entry?.[dateKey] === "success";
        if (ok) habitCheckInsThisWeek++;
      }
    }

    const weekStartKey = toDateKey(weekStart);
    const tasksCompletedThisWeek = tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.slice(0, 10) >= weekStartKey
    ).length;

    return {
      habitCheckInsThisWeek,
      tasksCompletedThisWeek,
      pomodorosToday,
    };
  }, [habits, checkIns, tasks, pomodorosToday]);

  return (
    <div className="flex h-full flex-col gap-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-100">Goals</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Simple numeric targets. Progress updates automatically from your activity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GoalCard
          icon={IconRepeat}
          label="Habit check-ins this week"
          current={progress.habitCheckInsThisWeek}
          target={goals.weeklyHabitTarget}
          onTargetChange={(v) => dispatch(setWeeklyHabitTarget(v))}
          unit="check-ins"
        />
        <GoalCard
          icon={IconBolt}
          label="Pomodoros today"
          current={progress.pomodorosToday}
          target={goals.dailyPomodoroTarget}
          onTargetChange={(v) => dispatch(setDailyPomodoroTarget(v))}
          unit="sessions"
        />
        <GoalCard
          icon={IconCheckbox}
          label="Tasks completed this week"
          current={progress.tasksCompletedThisWeek}
          target={goals.weeklyTaskTarget}
          onTargetChange={(v) => dispatch(setWeeklyTaskTarget(v))}
          unit="tasks"
        />
      </div>
    </div>
  );
}

export default GoalsPage;
