import { useSelector } from "react-redux";
import FloatingActionButton from "../components/FloatingActionButton";
import HabitCard from "../components/HabitCard";
import { selectAllHabits } from "../features/habits/habitsSlice";
import { useHabitActions } from "../features/habits/useHabitActions";
import HabitCreateModal from "../features/habits/HabitCreateModal";
import HabitEditModal from "../features/habits/HabitEditModal";

function HabitsPage() {
  const habits = useSelector(selectAllHabits);
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

  return (
    <div className="h-full">
      <h2 className="mb-4 text-3xl font-bold text-neutral-100">Habits</h2>

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
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
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
