import { getCategoryIconComponent } from "./categoryIcons";

/**
 * Squircle token: vibrant tile + white line icon + label + optional count line.
 */
export default function CategoryToken({
  label,
  iconKey,
  color,
  habitCount = 0,
  taskCount = 0,
  onClick,
  variant = "category",
  ariaLabel,
}) {
  const Icon = variant === "add" ? null : getCategoryIconComponent(iconKey);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (variant === "add" ? "Add category" : `Category ${label}`)}
      className="group flex flex-col items-center gap-3 w-[104px] sm:w-[80px] text-left bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xl"
    >
      <div
        className={[
          "relative flex aspect-square w-full items-center justify-center overflow-hidden transition-transform duration-200",
          "rounded-[20%] shadow-lg",
          variant === "add"
            ? "border-2 border-dashed border-neutral-600 bg-neutral-900/80 group-hover:border-neutral-400 group-hover:bg-neutral-800/80"
            : "group-active:scale-[0.98]",
        ].join(" ")}
        style={variant === "category" ? { backgroundColor: color } : undefined}
      >
        {variant === "add" ? (
          <span className="text-3xl font-light text-neutral-400 group-hover:text-neutral-200">+</span>
        ) : (
          Icon && <Icon stroke={1.5} size={40} className="text-white drop-shadow-sm" aria-hidden />
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-0.5 px-0.5">
        <span className="max-w-full truncate text-center text-[0.9375rem] font-semibold tracking-tight text-white">
          {label}
        </span>
        {variant === "category" && (
          <span className="text-center text-[11px] font-medium leading-tight text-neutral-500">
            {habitCount} {habitCount === 1 ? "habit" : "habits"} · {taskCount}{" "}
            {taskCount === 1 ? "task" : "tasks"}
          </span>
        )}
      </div>
    </button>
  );
}
