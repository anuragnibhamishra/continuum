import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../ui/Modal";
import { selectAllCategories } from "../../features/categories/categoriesSlice";
import { getCategoryIconComponent } from "../../features/categories/categoryIcons";
import { addHabit, toDateKey } from "../../features/habits/habitsSlice";
import { addTask } from "../../features/tasks/tasksSlice";

const CREATION_STEPS = {
  CATEGORY: "category",
  TYPE: "type",
  FORM: "form",
};

export default function CreateItemModal({ selectedDate, onClose }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const [creationStep, setCreationStep] = useState(CREATION_STEPS.CATEGORY);
  const [newItem, setNewItem] = useState({
    categoryId: null,
    type: null,
    name: "",
    description: "",
    frequency: "daily",
  });

  const handleCategoryChoose = (categoryId) => {
    setNewItem((prev) => ({ ...prev, categoryId }));
    setCreationStep(CREATION_STEPS.TYPE);
  };

  const handleTypeChoose = (type) => {
    setNewItem((prev) => ({
      ...prev,
      type,
      frequency: type === "single-task" ? "none" : "daily",
    }));
    setCreationStep(CREATION_STEPS.FORM);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.type || !newItem.categoryId) return;

    if (newItem.type === "habit") {
      const payload = {
        title: newItem.name.trim(),
        description: newItem.description.trim(),
        frequency: newItem.frequency,
        categoryId: newItem.categoryId,
      };
      if (newItem.frequency === "weekly") {
        payload.weekday = selectedDate.getDay();
      }
      if (newItem.frequency === "monthly") {
        payload.dayOfMonth = selectedDate.getDate();
      }
      dispatch(addHabit(payload));
    } else {
      const recurring = newItem.type === "recurring-task" ? newItem.frequency : "none";
      dispatch(
        addTask({
          title: newItem.name.trim(),
          description: newItem.description.trim(),
          dueDate: toDateKey(selectedDate),
          recurring,
          categoryId: newItem.categoryId,
        })
      );
    }
    onClose();
  };

  const handleBack = () => {
    if (creationStep === CREATION_STEPS.FORM) {
      setCreationStep(CREATION_STEPS.TYPE);
      return;
    }
    if (creationStep === CREATION_STEPS.TYPE) {
      setCreationStep(CREATION_STEPS.CATEGORY);
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === newItem.categoryId);
  const SelectedCategoryIcon = selectedCategory
    ? getCategoryIconComponent(selectedCategory.iconKey)
    : null;
  const primaryButtonLabel = newItem.type === "habit" ? "Add Habit" : "Add Task";

  const renderContent = () => {
    if (creationStep === CREATION_STEPS.CATEGORY) {
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">Select category first</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const Icon = getCategoryIconComponent(category.iconKey);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChoose(category.id)}
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
      );
    }

    if (creationStep === CREATION_STEPS.TYPE) {
      const typeOptions = [
        { id: "habit", label: "Habit", helper: "For routines you repeat" },
        { id: "recurring-task", label: "Recurring Task", helper: "For tasks on a schedule" },
        { id: "single-task", label: "Single Task", helper: "For one-time to-dos" },
      ];
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">Choose item type</p>
          {typeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleTypeChoose(option.id)}
              className="rounded-xl border border-neutral-700 bg-neutral-800/60 p-3 text-left hover:border-neutral-500"
            >
              <p className="font-medium text-neutral-100">{option.label}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{option.helper}</p>
            </button>
          ))}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg px-3 py-2 text-neutral-300 hover:bg-neutral-800"
            >
              Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="item-name" className="mb-1 block text-sm font-medium text-neutral-300">
            Name
          </label>
          <div className="flex items-center gap-2">
            {selectedCategory && SelectedCategoryIcon && (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[30%]"
                style={{ backgroundColor: selectedCategory.color }}
                title={selectedCategory.name}
              >
                <SelectedCategoryIcon stroke={1.5} size={20} className="text-white" />
              </span>
            )}
            <input
              id="item-name"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label htmlFor="item-description" className="mb-1 block text-sm font-medium text-neutral-300">
            Description
          </label>
          <textarea
            id="item-description"
            value={newItem.description}
            onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Optional notes..."
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        {newItem.type !== "single-task" && (
          <div>
            <label htmlFor="item-frequency" className="mb-1 block text-sm font-medium text-neutral-300">
              Frequency
            </label>
            <select
              id="item-frequency"
              value={newItem.frequency}
              onChange={(e) => setNewItem((prev) => ({ ...prev, frequency: e.target.value }))}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-neutral-800"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#7C3AED] px-4 py-2 font-medium text-white hover:bg-[#6D28D9] disabled:opacity-50"
              disabled={!newItem.name.trim() || !selectedCategory}
            >
              {primaryButtonLabel}
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <Modal title="Create New Item" onClose={onClose}>
      {renderContent()}
    </Modal>
  );
}
