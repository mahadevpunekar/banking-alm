import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const COLLAPSE_KEY = 'alm_sidebar_collapsed'

function readSidebarCollapsed(): boolean {
  return localStorage.getItem(COLLAPSE_KEY) === '1'
}

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed)

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      return next
    })
  }

  return (
    <div className="flex h-screen min-h-0 w-full overflow-hidden bg-[var(--color-alm-bg)]">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
