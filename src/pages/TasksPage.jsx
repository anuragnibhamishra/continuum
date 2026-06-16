import { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconCheck,
  IconCheckbox,
  IconDotsVertical,
} from "@tabler/icons-react";
import FloatingActionButton from "../components/FloatingActionButton";
import { selectAllCategories } from "../features/categories/categoriesSlice";
import { getCategoryIconComponent } from "../features/categories/categoryIcons";
import { toDateKey } from "../features/habits/habitsSlice";
import { selectAllTasks, isTaskDueOnDate } from "../features/tasks/tasksSlice";
import { useTaskActions } from "../features/tasks/useTaskActions";
import TaskCreateModal from "../features/tasks/TaskCreateModal";
import TaskEditModal from "../features/tasks/TaskEditModal";

function groupTasks(tasks) {
  const today = toDateKey(new Date());
  const todayList = [];
  const upcoming = [];
  const completed = [];

  for (const task of tasks) {
    const isOneTimeDone = task.completed && (!task.recurring || task.recurring === "none");
    if (isOneTimeDone) {
      completed.push(task);
      continue;
    }
    if (isTaskDueOnDate(task, new Date()) || (task.dueDate && task.dueDate <= today)) {
      todayList.push(task);
    } else {
      upcoming.push(task);
    }
  }

  return { today: todayList, upcoming, completed };
}

function TaskRow({ task, category, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const CategoryIcon = category ? getCategoryIconComponent(category.iconKey) : null;

  return (
    <li className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <button
        type="button"
        onClick={() => onToggle(task)}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          task.completed
            ? "bg-[#7C3AED] text-white"
            : "bg-neutral-800 text-neutral-400 hover:bg-[#7C3AED] hover:text-white"
        }`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? <IconCheck stroke={2} size={18} /> : null}
      </button>

      {category && CategoryIcon ? (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[30%]"
          style={{ backgroundColor: category.color }}
          title={category.name}
        >
          <CategoryIcon stroke={1.5} size={18} className="text-white" />
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className={`font-medium ${task.completed ? "text-neutral-500 line-through" : "text-neutral-100"}`}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500">
            {task.dueDate}
            {task.dueTime ? ` · ${task.dueTime}` : ""}
          </span>
          {task.recurring && task.recurring !== "none" && (
            <span className="rounded-full bg-neutral-700 px-2 py-0.5 text-xs capitalize text-neutral-400">
              {task.recurring}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          aria-label="Task actions"
        >
          <IconDotsVertical size={16} stroke={1.8} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 z-20 mt-2 w-28 rounded-lg border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(task);
              }}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(task.id);
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
}

function TaskSection({ title, tasks, categories, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) return null;

  return (
    <section className="mb-8">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-neutral-200">
        <IconCheckbox stroke={1.5} size={20} />
        {title}
        <span className="text-sm font-normal text-neutral-500">({tasks.length})</span>
      </h3>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => {
          const category = categories.find((c) => c.id === task.categoryId);
          return (
            <TaskRow
              key={task.id}
              task={task}
              category={category}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </ul>
    </section>
  );
}

function TasksPage() {
  const allTasks = useSelector(selectAllTasks);
  const categories = useSelector(selectAllCategories);
  const { today, upcoming, completed } = groupTasks(allTasks);
  const {
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
  } = useTaskActions();

  const isEmpty = allTasks.length === 0;

  return (
    <div className="h-full">
      <h2 className="mb-4 text-3xl font-bold text-neutral-100">Tasks</h2>

      {isEmpty ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
          <p className="text-neutral-400">Manage your tasks here</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 rounded-lg bg-[#7C3AED] px-4 py-2 font-medium text-white hover:bg-[#6D28D9]"
          >
            Add your first task
          </button>
        </div>
      ) : (
        <>
          <TaskSection
            title="Today"
            tasks={today}
            categories={categories}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
          <TaskSection
            title="Upcoming"
            tasks={upcoming}
            categories={categories}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
          <TaskSection
            title="Completed"
            tasks={completed}
            categories={categories}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
        </>
      )}

      <FloatingActionButton onClick={openCreate} />

      {isCreateOpen && (
        <TaskCreateModal onClose={closeCreate} onSubmit={submitCreate} />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          form={editForm}
          onChange={setEditForm}
          onClose={closeEdit}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );
}

export default TasksPage;
