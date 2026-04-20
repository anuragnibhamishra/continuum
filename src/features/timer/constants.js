/** Preset lengths in minutes: focus, short break, long break */
export const MODES = {
  long: { label: "Deep", focus: 50, short: 10, long: 30 },
  medium: { label: "Standard", focus: 45, short: 15, long: 20 },
  short: { label: "Classic", focus: 25, short: 5, long: 15 },
};

/** Number of full 3-focus cycles before loop counter stops incrementing */
export const TOTAL_LOOPS = 3;

export const PRESET_ORDER = ["long", "medium", "short"];
