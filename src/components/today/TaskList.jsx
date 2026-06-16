import { useState } from "react";
import { IconCheck, IconCheckbox, IconDotsVertical } from "@tabler/icons-react";

export default function TaskList({ tasksDue, onComplete, onEdit, onDelete }) {
  const [activeTaskMenuId, setActiveTaskMenuId] = useState(null);

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-neutral-200">
        <IconCheckbox stroke={1.5} size={20} />
        Tasks
      </h3>
      {tasksDue.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-neutral-500">
          <p className="text-sm">No tasks due for this day.</p>
          <p className="mt-1 text-xs">Add a task using the button below.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasksDue.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
            >
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-[#7C3AED] hover:text-white"
                aria-label="Mark complete"
              >
                <IconCheck stroke={2} size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-100">{task.title}</p>
                <div className="mt-1 flex items-center gap-2">
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
                  onClick={() =>
                    setActiveTaskMenuId((prev) => (prev === task.id ? null : task.id))
                  }
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  aria-label="Task actions"
                >
                  <IconDotsVertical size={16} stroke={1.8} />
                </button>
                {activeTaskMenuId === task.id && (
                  <div className="absolute right-0 z-20 mt-2 w-28 rounded-lg border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(task);
                        setActiveTaskMenuId(null);
                      }}
                      className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(task.id);
                        setActiveTaskMenuId(null);
                      }}
                      className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-300 hover:bg-neutral-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
