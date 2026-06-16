import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addHabit, updateHabit, removeHabit } from "./habitsSlice";

export function useHabitActions() {
  const dispatch = useDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const openEdit = useCallback((habit) => {
    setEditingHabit(habit);
    setEditForm({ title: habit.title, description: habit.description ?? "" });
  }, []);

  const closeEdit = useCallback(() => setEditingHabit(null), []);

  const submitCreate = useCallback(
    (payload) => {
      dispatch(addHabit(payload));
    },
    [dispatch]
  );

  const submitEdit = useCallback(
    (e) => {
      e.preventDefault();
      if (!editingHabit || !editForm.title.trim()) return;
      dispatch(
        updateHabit({
          id: editingHabit.id,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
        })
      );
      setEditingHabit(null);
    },
    [dispatch, editingHabit, editForm]
  );

  const deleteHabit = useCallback(
    (habitId) => {
      dispatch(removeHabit(habitId));
    },
    [dispatch]
  );

  return {
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
  };
}
