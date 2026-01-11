import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutGrid, Library, PlusCircle, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  highlight?: boolean
}

const navItems: NavItem[] = [
  { to: '/app', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/app/library', icon: Library, label: 'Bibliothèque' },
  { to: '/app/create', icon: PlusCircle, label: 'Ajouter', highlight: true },
  { to: '/app/settings', icon: Settings, label: 'Paramètres' },
]

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="relative flex h-screen w-full max-w-full flex-col overflow-x-hidden bg-stone-50 bg-noise md:flex-row">
      {/* Desktop Sidebar - Île flottante */}
      <aside className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white/90 shadow-xl backdrop-blur md:flex">
        {/* Logo */}
        <div className="border-b border-stone-200/50 p-6">
          <h1 className="text-xl font-semibold text-slate-900">Mind Drawer</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? item.highlight
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-700'
                      : item.highlight
                        ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Profile Section (placeholder) */}
        <div className="border-t border-stone-200/50 p-4">
          <div className="flex items-center gap-3 rounded-lg px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
              U
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900">Utilisateur</div>
              <div className="text-xs text-slate-500">user@example.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar - Dock flottant */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around rounded-2xl border border-stone-200 bg-white/90 px-3 py-2 shadow-2xl backdrop-blur md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/app'
              ? location.pathname === '/app'
              : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 rounded-xl w-full min-w-0 flex-1 px-2 py-1 text-xs transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <div className="relative flex flex-col items-center">
                <Icon className={cn('h-5 w-5 transition-colors', isActive && 'text-blue-600')} />
                {item.highlight && !isActive && (
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors whitespace-nowrap',
                  isActive ? 'text-blue-700' : 'text-slate-500'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 md:ml-[calc(16rem+1rem)] md:pb-0 md:pt-4">
        <Outlet />
      </main>
    </div>
  )
}
