import { IconPlus } from "@tabler/icons-react";

function FloatingActionButton({ onClick }) {
  return (
    <div className="fixed bottom-8 max-sm:bottom-16 right-8 max-sm:right-4">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8338EC] hover:bg-[#7028CC] text-white rounded-lg shadow-lg transition-all duration-300 z-50 font-medium"
      >
        <IconPlus stroke={2.5} size={20} />
        <span>Add New</span>
      </button>
    </div>
  );
}

export default FloatingActionButton;
