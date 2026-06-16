import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconDotsVertical, IconFlame } from "@tabler/icons-react";
import {
  checkIn,
  uncheck,
  computeStreak,
  toDateKey,
  isHabitDueOnDate,
} from "../features/habits/habitsSlice";
import { selectAllCategories } from "../features/categories/categoriesSlice";
import { getCategoryIconComponent } from "../features/categories/categoryIcons";

function getLast7Days() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
}

function getFrequencyLabel(frequency) {
  if (frequency === "daily") return "Every day";
  if (frequency === "weekly") return "Every week";
  if (frequency === "monthly") return "Every month";
  return frequency;
}

function HabitCard({ habit, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = useSelector(selectAllCategories);
  const checkIns = useSelector((state) => state.habits.checkIns[habit.id] ?? {});
  const successDates = Object.entries(checkIns)
    .filter(([, status]) => status === "success")
    .map(([date]) => date);
  const streak = computeStreak(successDates, habit.frequency);
  const last7Days = getLast7Days();

  const dueDays = last7Days.filter((date) => isHabitDueOnDate(habit, date));
  const completedDueDays = dueDays.filter((date) =>
    successDates.includes(toDateKey(date))
  ).length;
  const completionPercentage =
    dueDays.length > 0 ? Math.round((completedDueDays / dueDays.length) * 100) : 0;

  const category = categories.find((cat) => cat.id === habit.categoryId);
  const CategoryIcon = category ? getCategoryIconComponent(category.iconKey) : null;

  const handleDayClick = (date) => {
    if (!isHabitDueOnDate(habit, date)) return;
    const dateKey = toDateKey(date);
    if (successDates.includes(dateKey)) {
      dispatch(uncheck({ habitId: habit.id, dateKey }));
    } else {
      dispatch(checkIn({ habitId: habit.id, dateKey }));
    }
  };

  const getDayColor = (date) => {
    const dateKey = toDateKey(date);
    const isCompleted = successDates.includes(dateKey);
    const isDue = isHabitDueOnDate(habit, date);
    const isToday = toDateKey(new Date()) === dateKey;

    if (isCompleted) return "bg-emerald-500 text-white";
    if (!isDue) return "bg-neutral-800 text-neutral-600 cursor-not-allowed";
    if (isToday) return "border-2 border-orange-500 text-orange-500";
    return "border border-neutral-500 text-neutral-400";
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {category && CategoryIcon ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[30%]"
              style={{ backgroundColor: category.color }}
              title={category.name}
            >
              <CategoryIcon stroke={1.5} size={20} className="text-white" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-neutral-100">{habit.title}</h3>
            <p className="text-sm text-emerald-400">
              {getFrequencyLabel(habit.frequency)}
              {habit.goalCount > 1 ? ` · ${habit.goalCount}P` : ""}
            </p>
            {habit.description ? (
              <p className="mt-1 text-xs text-neutral-500">{habit.description}</p>
            ) : null}
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            aria-label="Habit actions"
          >
            <IconDotsVertical size={16} stroke={1.8} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-28 rounded-lg border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(habit);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(habit.id);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-300 hover:bg-neutral-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 flex justify-between gap-2">
        {last7Days.map((date) => {
          const dateKey = toDateKey(date);
          const isDue = isHabitDueOnDate(habit, date);
          const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });

          return (
            <div key={dateKey} className="flex flex-col items-center gap-1">
              <span className="text-xs text-neutral-500">{dayLabel}</span>
              <button
                type="button"
                onClick={() => handleDayClick(date)}
                disabled={!isDue}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${getDayColor(date)}`}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-neutral-300">
            <span className="text-emerald-400">✓</span>
            <span>{completedDueDays}</span>
          </div>
          <span className="text-neutral-400">{completionPercentage}%</span>
          <div className="flex items-center gap-1 text-orange-400">
            <IconFlame size={16} stroke={1.8} />
            <span>{streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;
