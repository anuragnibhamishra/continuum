import { NavLink } from "react-router-dom";
import {
  IconCalendarCheck,
  IconCheckbox,
  IconTarget,
  IconClock,
} from "@tabler/icons-react";

const mobilePrimaryNavItems = [
  { name: "Today", path: "/today", icon: IconCalendarCheck },
  { name: "Tasks", path: "/tasks", icon: IconCheckbox },
  { name: "Focus", path: "/focus", icon: IconTarget },
  { name: "Timer", path: "/timer", icon: IconClock },
];

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-900/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {mobilePrimaryNavItems.map(({ name, path, icon }) => {
          const Icon = icon;
          return (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center justify-center rounded-xl py-2 transition-colors ${
                    isActive
                      ? "bg-neutral-800/90 text-purple-500"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                  }`
                }
                aria-label={name}
              >
                <Icon stroke={1.8} size={22} />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileBottomNav;
