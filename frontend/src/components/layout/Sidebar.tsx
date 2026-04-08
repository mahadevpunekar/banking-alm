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
      className={`flex h-full shrink-0 flex-col border-r border-white/[0.06] bg-[var(--color-alm-nav)] transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[72px]' : 'w-56 sm:w-[15.5rem]'
      }`}
    >
      <div className="flex h-[3.25rem] shrink-0 items-center border-b border-white/[0.06] bg-[var(--color-alm-nav-deep)] px-2">
        {!collapsed ? (
          <div className="flex w-full items-center px-2 py-2">
            <div className="rounded-sm bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
              <img
                src={assimilateLogo}
                alt="Assimilate"
                className="max-h-8 w-auto max-w-[9.5rem] object-contain object-left"
              />
            </div>
          </div>
        ) : (
          <img
            src="/logo_icon.png"
            alt="Assimilate"
            className="mx-auto h-9 w-9 rounded-sm object-contain ring-1 ring-white/10"
            width={36}
            height={36}
          />
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2 pt-3" aria-label="Primary">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-[3px] border-l-sky-400 bg-white/[0.08] text-white'
                  : 'border-l-[3px] border-l-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
              } ${collapsed ? 'justify-center px-2' : 'ps-2.5 pe-3'}`
            }
          >
            <Icon className="h-[1.15rem] w-[1.15rem] shrink-0 opacity-90" aria-hidden />
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] bg-[var(--color-alm-nav-deep)] p-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-sm py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
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
