import { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconCheck,
  IconRepeat,
  IconDotsVertical,
  IconChevronDown,
} from "@tabler/icons-react";
import { selectAllCategories } from "../../features/categories/categoriesSlice";
import { getCategoryIconComponent } from "../../features/categories/categoryIcons";
import {
  selectCheckIns,
  computeStreak,
} from "../../features/habits/habitsSlice";

const ENTRY_OPTIONS = [
  { value: "not_checked", label: "Not Checked", buttonClass: "bg-neutral-800 text-neutral-300" },
  { value: "success", label: "Success", buttonClass: "bg-emerald-600 text-white" },
  { value: "failed", label: "Failed", buttonClass: "bg-red-600 text-white" },
  { value: "skipped", label: "Skipped", buttonClass: "bg-amber-600 text-white" },
];

function getHabitStatus(entry, dateKey) {
  if (Array.isArray(entry)) return entry.includes(dateKey) ? "success" : "not_checked";
  return entry?.[dateKey] ?? "not_checked";
}

function getHabitSuccessDates(entry) {
  if (Array.isArray(entry)) return entry;
  return Object.entries(entry ?? {})
    .filter(([, status]) => status === "success")
    .map(([date]) => date);
}

export default function HabitList({
  habitsDue,
  dateKey,
  onToggle,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const checkIns = useSelector(selectCheckIns);
  const categories = useSelector(selectAllCategories);
  const [activeEntryMenuHabitId, setActiveEntryMenuHabitId] = useState(null);
  const [activeHabitMenuId, setActiveHabitMenuId] = useState(null);

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-neutral-200">
        <IconRepeat stroke={1.5} size={20} />
        Habits
      </h3>
      {habitsDue.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-neutral-500">
          <p className="text-sm">No habits due for this day.</p>
          <p className="mt-1 text-xs">Add a habit using the button below.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {habitsDue.map((habit) => {
            const category = categories.find((cat) => cat.id === habit.categoryId);
            const CategoryIcon = category ? getCategoryIconComponent(category.iconKey) : null;
            const habitEntry = checkIns[habit.id];
            const status = getHabitStatus(habitEntry, dateKey);
            const checked = status === "success";
            const streak = computeStreak(
              getHabitSuccessDates(habitEntry),
              habit.frequency,
              dateKey
            );
            const activeStatus =
              ENTRY_OPTIONS.find((option) => option.value === status) ?? ENTRY_OPTIONS[0];

            return (
              <li
                key={habit.id}
                className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {category && CategoryIcon ? (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[30%]"
                      style={{ backgroundColor: category.color }}
                      title={category.name}
                    >
                      <CategoryIcon stroke={1.5} size={20} className="text-white" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggle(habit.id, checked)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        checked
                          ? "bg-[#7C3AED] text-white"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                      aria-label={checked ? "Mark incomplete" : "Mark complete"}
                    >
                      {checked ? <IconCheck stroke={2} size={18} /> : null}
                    </button>
                  )}
                  <div className="flex min-w-0 flex-col">
                    <p className="font-medium text-neutral-100">{habit.title}</p>
                    <span className="text-xs text-neutral-500">
                      {habit.description || habit.frequency}
                      {streak > 0 ? ` · ${streak} streak` : ""}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEntryMenuHabitId((prev) => (prev === habit.id ? null : habit.id))
                    }
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${activeStatus.buttonClass}`}
                  >
                    {activeStatus.label}
                    <IconChevronDown size={14} stroke={2} />
                  </button>
                  {activeEntryMenuHabitId === habit.id && (
                    <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
                      {ENTRY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onStatusChange(habit.id, option.value);
                            setActiveEntryMenuHabitId(null);
                          }}
                          className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHabitMenuId((prev) => (prev === habit.id ? null : habit.id))
                    }
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    aria-label="Habit actions"
                  >
                    <IconDotsVertical size={16} stroke={1.8} />
                  </button>
                  {activeHabitMenuId === habit.id && (
                    <div className="absolute right-0 z-20 mt-2 w-28 rounded-lg border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          onEdit(habit);
                          setActiveHabitMenuId(null);
                        }}
                        className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(habit.id);
                          setActiveHabitMenuId(null);
                        }}
                        className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-300 hover:bg-neutral-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
