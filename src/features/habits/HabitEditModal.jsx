import Modal from "../../components/ui/Modal";

export default function HabitEditModal({ habit, form, onChange, onClose, onSubmit }) {
  if (!habit) return null;

  return (
    <Modal title="Edit Habit" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="edit-habit-title" className="mb-1 block text-sm font-medium text-neutral-300">
            Name
          </label>
          <input
            id="edit-habit-title"
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            autoFocus
          />
        </div>
        <div>
          <label
            htmlFor="edit-habit-description"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Description
          </label>
          <textarea
            id="edit-habit-description"
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
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
