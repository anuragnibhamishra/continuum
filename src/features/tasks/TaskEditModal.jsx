import Modal from "../../components/ui/Modal";

export default function TaskEditModal({ task, form, onChange, onClose, onSubmit }) {
  if (!task) return null;

  return (
    <Modal title="Edit Task" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="edit-task-title" className="mb-1 block text-sm font-medium text-neutral-300">
            Name
          </label>
          <input
            id="edit-task-title"
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            autoFocus
          />
        </div>
        <div>
          <label
            htmlFor="edit-task-description"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Description
          </label>
          <textarea
            id="edit-task-description"
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <label htmlFor="edit-task-due" className="mb-1 block text-sm font-medium text-neutral-300">
            Due date
          </label>
          <input
            id="edit-task-due"
            type="date"
            value={form.dueDate}
            onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <label htmlFor="edit-task-recurring" className="mb-1 block text-sm font-medium text-neutral-300">
            Recurring
          </label>
          <select
            id="edit-task-recurring"
            value={form.recurring}
            onChange={(e) => onChange({ ...form, recurring: e.target.value })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title.trim()}
            className="rounded-lg bg-[#7C3AED] px-4 py-2 font-medium text-white hover:bg-[#6D28D9] disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
