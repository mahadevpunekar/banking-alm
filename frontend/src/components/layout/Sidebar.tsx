import {
  ChevronLeft,
  ChevronRight,
  Database,
  Droplets,
  FileBarChart,
  LayoutDashboard,
  Percent,
  Settings,
  ShieldAlert,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import assimilateLogo from '@/assets/assimilate_logo.png'
import logoIcon from '@/assets/logo_icon.png'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/liquidity', label: 'Liquidity risk', icon: Droplets },
  { to: '/irrbb', label: 'IRRBB', icon: Percent },
  { to: '/stress', label: 'Stress testing', icon: ShieldAlert },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/data-integration', label: 'Data integration', icon: Database },
  { to: '/settings', label: 'Settings', icon: Settings },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[72px]' : 'w-56 sm:w-60'
      }`}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-slate-100 px-2">
        {!collapsed ? (
          <img
            src={assimilateLogo}
            alt="Assimilate"
            className="max-h-10 w-auto max-w-full object-contain object-left"
          />
        ) : (
          <img
            src={logoIcon}
            alt="Assimilate"
            className="mx-auto h-9 w-9 object-contain"
            width={36}
            height={36}
          />
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Primary">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <Icon className="h-5 w-5 shrink-0 text-current opacity-80" aria-hidden />
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
