import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBolt, IconPlayerPlay } from "@tabler/icons-react";
import { selectTasksDueOnDate } from "../features/tasks/tasksSlice";
import { setActiveTaskId } from "../features/timer/timerSlice";
import { selectTimerStats } from "../features/timer/timerSlice";

function FocusPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const tasksDue = useSelector((state) => selectTasksDueOnDate(state, today));
  const { pomodorosToday, activeTaskId } = useSelector(selectTimerStats);
  const [selectedTaskId, setSelectedTaskId] = useState(activeTaskId);

  const handleStartFocus = () => {
    dispatch(setActiveTaskId(selectedTaskId));
    navigate("/timer");
  };

  const selectedTask = tasksDue.find((t) => t.id === selectedTaskId);

  return (
    <div className="flex h-full flex-col gap-8">
      <header>
        <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[#A78BFA]">Deep work</div>
        <h1 className="text-3xl font-semibold text-neutral-100 tracking-tight">Focus</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Pick a task to focus on, then start a Pomodoro session. Your selection carries over to the
          timer.
        </p>
      </header>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-300">
        <span className="text-neutral-500">Pomodoros today</span>{" "}
        <span className="font-semibold text-[#C4B5FD] tabular-nums">{pomodorosToday}</span>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-200">Today&apos;s focus targets</h2>
        {tasksDue.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-neutral-500">
            <p className="text-sm">No tasks due today.</p>
            <p className="mt-1 text-xs">Add tasks on Today or Tasks, then return here to focus.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasksDue.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selectedTaskId === task.id
                      ? "border-[#7C3AED] bg-[#7C3AED]/10"
                      : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                  }`}
                >
                  <p className="font-medium text-neutral-100">{task.title}</p>
                  {task.description ? (
                    <p className="mt-1 text-xs text-neutral-500">{task.description}</p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleStartFocus}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]"
        >
          <IconPlayerPlay size={20} stroke={1.8} />
          {selectedTask ? `Start focus on "${selectedTask.title}"` : "Start focus session"}
        </button>
        {selectedTaskId && (
          <button
            type="button"
            onClick={() => setSelectedTaskId(null)}
            className="rounded-xl px-4 py-3 text-sm text-neutral-400 hover:text-neutral-200"
          >
            Clear selection
          </button>
        )}
      </div>

      {activeTaskId && selectedTask && activeTaskId === selectedTask.id && (
        <p className="flex items-center gap-2 text-xs text-[#A78BFA]">
          <IconBolt size={14} />
          This task is linked to your current focus session.
        </p>
      )}
    </div>
  );
}

export default FocusPage;
