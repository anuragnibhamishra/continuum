import { NavLink } from "react-router-dom";
import {
  IconCalendarCheck,
  IconRepeat,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";

const mobilePrimaryNavItems = [
  { name: "Today", path: "/today", icon: IconCalendarCheck },
  { name: "Habits", path: "/habits", icon: IconRepeat },
  { name: "Analytics", path: "/analytics", icon: IconChartBar },
  { name: "Timer", path: "/timer", icon: IconClock },
];

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-900/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {mobilePrimaryNavItems.map(({ name, path, icon: Icon }) => (
          <li key={name}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center justify-center rounded-xl py-2 transition-colors ${
                  isActive
                    ? "text-purple-500 bg-neutral-800/90"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`
              }
              aria-label={name}
            >
              <Icon stroke={1.8} size={22} />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileBottomNav;
