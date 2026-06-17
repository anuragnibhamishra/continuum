import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FloatingActionButton from "../components/FloatingActionButton";
import HabitCard from "../components/HabitCard";
import {
  selectAllHabits,
  selectCheckIns,
  computeStreak,
} from "../features/habits/habitsSlice";
import { selectAllCategories } from "../features/categories/categoriesSlice";
import { useHabitActions } from "../features/habits/useHabitActions";
import HabitCreateModal from "../features/habits/HabitCreateModal";
import HabitEditModal from "../features/habits/HabitEditModal";

function getHabitStreak(habit, checkIns) {
  const entry = checkIns[habit.id];
  const successDates = Array.isArray(entry)
    ? entry
    : Object.entries(entry ?? {})
        .filter(([, status]) => status === "success")
        .map(([date]) => date);
  return computeStreak(successDates, habit.frequency);
}

function HabitsPage() {
  const habits = useSelector(selectAllHabits);
  const checkIns = useSelector(selectCheckIns);
  const categories = useSelector(selectAllCategories);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const {
    isCreateOpen,
    openCreate,
    closeCreate,
    submitCreate,
    editingHabit,
    editForm,
    setEditForm,
    openEdit,
    closeEdit,
    submitEdit,
    deleteHabit,
  } = useHabitActions();

  const filteredHabits = useMemo(() => {
    let list = [...habits];
    if (categoryFilter !== "all") {
      list = list.filter((h) => h.categoryId === categoryFilter);
    }
    list.sort((a, b) => {
      if (sortBy === "streak") {
        return getHabitStreak(b, checkIns) - getHabitStreak(a, checkIns);
      }
      if (sortBy === "frequency") {
        return a.frequency.localeCompare(b.frequency);
      }
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [habits, checkIns, categoryFilter, sortBy]);

  return (
    <div className="h-full">
      <header className="mb-6">
        <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[#A78BFA]">Routines</div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">Habits</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Track recurring habits, check in across the week, and watch streaks grow.
        </p>
      </header>

      {habits.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200"
          >
            <option value="name">Sort by name</option>
            <option value="streak">Sort by streak</option>
            <option value="frequency">Sort by frequency</option>
          </select>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
          <p className="text-neutral-400">Track and manage your habits here</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 rounded-lg bg-[#7C3AED] px-4 py-2 font-medium text-white hover:bg-[#6D28D9]"
          >
            Add your first habit
          </button>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">
          <p className="text-sm">No habits match this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={openEdit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      <FloatingActionButton onClick={openCreate} />

      {isCreateOpen && (
        <HabitCreateModal onClose={closeCreate} onSubmit={submitCreate} />
      )}

      {editingHabit && (
        <HabitEditModal
          habit={editingHabit}
          form={editForm}
          onChange={setEditForm}
          onClose={closeEdit}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );
}

export default HabitsPage;
