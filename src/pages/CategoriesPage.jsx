import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/ui/Modal";
import CategoryToken from "../features/categories/CategoryToken";
import {
  addCategory,
  removeCategory,
  selectCategoriesWithCounts,
  updateCategory,
} from "../features/categories/categoriesSlice";
import { CATEGORY_ICON_MAP, CATEGORY_ICON_OPTIONS } from "../features/categories/categoryIcons";
import { selectAllHabits, updateHabit } from "../features/habits/habitsSlice";
import { selectAllTasks, updateTask } from "../features/tasks/tasksSlice";

export const COLOR_PRESETS = [
  "#ef4444", // red → quit / negative habits
  "#f97316", // orange → energy / outdoor
  "#eab308", // yellow → nutrition / alertness
  "#84cc16", // lime → health / growth
  "#22c55e", // green → finance / success
  "#14b8a6", // teal → social / calm
  "#06b6d4", // cyan → focus / clarity
  "#3b82f6", // blue → work / productivity
  "#8b5cf6", // purple → study / deep thinking
  "#ec4899", // pink → art / creativity
];

function CategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoriesWithCounts);
  const allHabits = useSelector(selectAllHabits);
  const allTasks = useSelector(selectAllTasks);

  const [modal, setModal] = useState(null);
  /** @type {{ name: string; iconKey: string; color: string }} */
  const [form, setForm] = useState({
    name: "",
    iconKey: "other",
    color: COLOR_PRESETS[0],
  });

  const openAdd = useCallback(() => {
    setForm({ name: "", iconKey: "other", color: COLOR_PRESETS[0] });
    setModal({ mode: "add" });
  }, []);

  const openEdit = useCallback((cat) => {
    setForm({
      name: cat.name,
      iconKey: cat.iconKey,
      color: cat.color,
    });
    setModal({ mode: "edit", id: cat.id });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!form.name.trim()) return;
      if (modal?.mode === "add") {
        dispatch(
          addCategory({
            name: form.name,
            iconKey: form.iconKey,
            color: form.color,
          })
        );
      } else if (modal?.mode === "edit" && modal.id) {
        dispatch(
          updateCategory({
            id: modal.id,
            name: form.name,
            iconKey: form.iconKey,
            color: form.color,
          })
        );
      }
      closeModal();
    },
    [closeModal, dispatch, form.color, form.iconKey, form.name, modal]
  );

  const handleDelete = useCallback(() => {
    if (modal?.mode !== "edit" || !modal.id) return;
    const id = modal.id;
    dispatch(removeCategory(id));
    allHabits.forEach((h) => {
      if (h.categoryId === id) dispatch(updateHabit({ id: h.id, categoryId: null }));
    });
    allTasks.forEach((t) => {
      if (t.categoryId === id) dispatch(updateTask({ id: t.id, categoryId: null }));
    });
    closeModal();
  }, [allHabits, allTasks, closeModal, dispatch, modal]);

  const modalTitle = modal?.mode === "add" ? "New category" : "Edit category";

  const iconPicker = useMemo(
    () => (
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Icon</p>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORY_ICON_OPTIONS.map((key) => {
            const Cmp = CATEGORY_ICON_MAP[key];
            const selected = form.iconKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setForm((f) => ({ ...f, iconKey: key }))}
                className={[
                  "flex h-11 items-center justify-center rounded-xl border transition-colors",
                  selected
                    ? "border-white bg-neutral-800 text-white"
                    : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200",
                ].join(" ")}
                aria-label={`Icon ${key}`}
                aria-pressed={selected}
              >
                <Cmp size={22} stroke={1.5} />
              </button>
            );
          })}
        </div>
      </div>
    ),
    [form.iconKey]
  );

  return (
    <div className=" h-full w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Organize habits and tasks. Counts update from items assigned to each category.
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] justify-center gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:gap-x-6">
        {categories.map((cat) => (
          <CategoryToken
            key={cat.id}
            label={cat.name}
            iconKey={cat.iconKey}
            color={cat.color}
            habitCount={cat.habitCount}
            taskCount={cat.taskCount}
            onClick={() => openEdit(cat)}
          />
        ))}
        <CategoryToken variant="add" label="Add" onClick={openAdd} />
      </div>

      {modal && (
        <Modal title={modalTitle} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="cat-name" className="mb-1.5 block text-sm font-medium text-neutral-300">
                Name
              </label>
              <input
                id="cat-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                placeholder="e.g. Health"
                autoFocus
                maxLength={40}
              />
            </div>

            {iconPicker}

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Color</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => {
                  const selected = form.color === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className={[
                        "h-9 w-9 rounded-xl border-2 transition-transform",
                        selected ? "scale-110 border-white" : "border-transparent hover:scale-105",
                      ].join(" ")}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                      aria-pressed={selected}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              {modal.mode === "edit" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="order-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 sm:order-1"
                >
                  Delete category
                </button>
              )}
              <div className={`flex gap-2 ${modal.mode === "edit" ? "sm:order-2 sm:ml-auto" : "ml-auto"}`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.name.trim()}
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-neutral-50 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {modal.mode === "add" ? "Add" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default CategoriesPage;
