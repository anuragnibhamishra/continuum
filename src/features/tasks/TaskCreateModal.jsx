import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../components/ui/Modal";
import { selectAllCategories } from "../categories/categoriesSlice";
import { getCategoryIconComponent } from "../categories/categoryIcons";
import { toDateKey } from "../habits/habitsSlice";

const STEPS = { CATEGORY: "category", FORM: "form" };

export default function TaskCreateModal({ onClose, onSubmit }) {
  const categories = useSelector(selectAllCategories);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [form, setForm] = useState({
    categoryId: null,
    name: "",
    description: "",
    dueDate: toDateKey(new Date()),
    recurring: "none",
  });

  const selectedCategory = categories.find((cat) => cat.id === form.categoryId);
  const SelectedCategoryIcon = selectedCategory
    ? getCategoryIconComponent(selectedCategory.iconKey)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) return;
    onSubmit({
      title: form.name.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      recurring: form.recurring,
      categoryId: form.categoryId,
    });
    onClose();
  };

  if (step === STEPS.CATEGORY) {
    return (
      <Modal title="Add Task" onClose={onClose}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">Select category</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const Icon = getCategoryIconComponent(category.iconKey);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, categoryId: category.id }));
                    setStep(STEPS.FORM);
                  }}
                  className="rounded-xl border border-neutral-700 bg-neutral-800/60 p-3 text-left hover:border-neutral-500"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-[30%]"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon stroke={1.5} size={20} className="text-white" />
                    </span>
                    <span className="text-sm font-medium text-neutral-200">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Add Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="task-name" className="mb-1 block text-sm font-medium text-neutral-300">
            Name
          </label>
          <div className="flex items-center gap-2">
            {selectedCategory && SelectedCategoryIcon && (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[30%]"
                style={{ backgroundColor: selectedCategory.color }}
              >
                <SelectedCategoryIcon stroke={1.5} size={20} className="text-white" />
              </span>
            )}
            <input
              id="task-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-neutral-300">
            Description
          </label>
          <textarea
            id="task-description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Optional notes..."
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div>
          <label htmlFor="task-due" className="mb-1 block text-sm font-medium text-neutral-300">
            Due date
          </label>
          <input
            id="task-due"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div>
          <label htmlFor="task-recurring" className="mb-1 block text-sm font-medium text-neutral-300">
            Recurring
          </label>
          <select
            id="task-recurring"
            value={form.recurring}
            onChange={(e) => setForm((prev) => ({ ...prev, recurring: e.target.value }))}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => setStep(STEPS.CATEGORY)}
            className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-neutral-800"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-neutral-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.name.trim() || !form.categoryId}
              className="rounded-lg bg-[#7C3AED] px-4 py-2 font-medium text-white hover:bg-[#6D28D9] disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
