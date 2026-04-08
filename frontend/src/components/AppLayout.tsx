import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' nav-link--active' : ''}`

export function AppLayout() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <div className="brand-title">Banking ALM</div>
            <div className="brand-sub">Modular platform</div>
          </div>
        </div>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Overview
          </NavLink>
          <NavLink to="/data-integration" className={linkClass}>
            Data integration
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
