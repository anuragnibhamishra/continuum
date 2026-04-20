import {
  IconBan,
  IconPalette,
  IconYoga,
  IconSchool,
  IconBike,
  IconTicket,
  IconMessage,
  IconCurrencyDollar,
  IconBriefcase,
  IconToolsKitchen2,
  IconHome,
  IconMountain,
  IconSquares,
  IconPlus,
} from "@tabler/icons-react";

/** Keys persisted on category records; map to Tabler icons (white stroke on colored tile). */
export const CATEGORY_ICON_MAP = {
  ban: IconBan,                // Quit bad habit
  palette: IconPalette,       // Art
  meditation: IconYoga,       // Meditation
  study: IconSchool,          // Study
  sports: IconBike,           // Sports
  entertainment: IconTicket,  // Entertainment
  social: IconMessage,        // Social
  finance: IconCurrencyDollar,// Finance
  health: IconPlus,           // Health
  work: IconBriefcase,        // Work
  nutrition: IconToolsKitchen2, // Nutrition
  home: IconHome,             // Home
  outdoor: IconMountain,      // Outdoor
  other: IconSquares,         // Other
  create: IconPlus            // Create category
};


export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICON_MAP).filter((key) => key !== "create");

export function getCategoryIconComponent(iconKey) {
  return CATEGORY_ICON_MAP[iconKey] ?? CATEGORY_ICON_MAP.other;
}
