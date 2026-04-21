import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconCalendarCheck, IconTarget, IconRepeat, IconCheckbox, IconFlag, IconTags, IconChartBar, IconClock, IconSettings, IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from '@tabler/icons-react';

const menuItems = [
  { name: 'Today', path: '/today', icon: <IconCalendarCheck stroke={1.5} /> },
  { name: 'Focus', path: '/focus', icon: <IconTarget stroke={1.5} /> },
  { name: 'Habits', path: '/habits', icon: <IconRepeat stroke={1.5} /> },
  { name: 'Tasks', path: '/tasks', icon: <IconCheckbox stroke={1.5} /> },
  { name: 'Goals', path: '/goals', icon: <IconFlag stroke={1.5} /> },
  { name: 'Categories', path: '/categories', icon: <IconTags stroke={1.5} /> },
  { name: 'Analytics', path: '/analytics', icon: <IconChartBar stroke={1.5} /> },
  { name: 'Timer', path: '/timer', icon: <IconClock stroke={1.5} /> },
]

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-300`}>
      {/* Logo/Header */}
      <div className="p-4 flex border-b border-neutral-800">
        <div className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center gap-3 ${isCollapsed ? 'px-0' : 'px-4'} py-3 rounded-lg transition-all duration-300 text-left`}>
          {!isCollapsed && <h1 className='text-xl font-medium leading-none'>Continuum</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='text-neutral-400 hover:text-neutral-200'
          >
            {isCollapsed ? <IconLayoutSidebarRightCollapse stroke={1.5} /> : <IconLayoutSidebarLeftCollapse stroke={1.5} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                isActive
                  ? 'bg-neutral-800/80 text-purple-500 shadow-lg'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? item.name : ''}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings Tab at Bottom */}
      <div className="border-t border-neutral-800 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
              isActive
                ? 'bg-neutral-800 text-[#7C3AED] shadow-lg'
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
          title={isCollapsed ? 'Settings' : ''}
        >
          <span className="text-xl"><IconSettings stroke={1.5} /></span>
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
