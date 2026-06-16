import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask, removeTask, completeTask, uncompleteTask } from "./tasksSlice";

export function useTaskActions() {
  const dispatch = useDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    recurring: "none",
  });

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const openEdit = useCallback((task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description ?? "",
      dueDate: task.dueDate ?? "",
      recurring: task.recurring ?? "none",
    });
  }, []);

  const closeEdit = useCallback(() => setEditingTask(null), []);

  const submitCreate = useCallback(
    (payload) => {
      dispatch(addTask(payload));
    },
    [dispatch]
  );

  const submitEdit = useCallback(
    (e) => {
      e.preventDefault();
      if (!editingTask || !editForm.title.trim()) return;
      dispatch(
        updateTask({
          id: editingTask.id,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          dueDate: editForm.dueDate,
          recurring: editForm.recurring,
        })
      );
      setEditingTask(null);
    },
    [dispatch, editingTask, editForm]
  );

  const deleteTask = useCallback(
    (taskId) => {
      dispatch(removeTask(taskId));
    },
    [dispatch]
  );

  const toggleComplete = useCallback(
    (task) => {
      if (task.completed) {
        dispatch(uncompleteTask(task.id));
      } else {
        dispatch(completeTask(task.id));
      }
    },
    [dispatch]
  );

  return {
    isCreateOpen,
    openCreate,
    closeCreate,
    submitCreate,
    editingTask,
    editForm,
    setEditForm,
    openEdit,
    closeEdit,
    submitEdit,
    deleteTask,
    toggleComplete,
  };
}
