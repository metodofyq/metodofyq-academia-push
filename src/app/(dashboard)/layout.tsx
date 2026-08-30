import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Home, CheckSquare, BookOpen, ListChecks, Trophy, CalendarDays, User, LogOut, Flame, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { computeStreak } from '@/lib/dashboard/streak'

type NavLink = { href: string; label: string; icon: typeof Home }
type NavEntry = NavLink | { label: string; icon: typeof Home; children: NavLink[] }

const nav: NavEntry[] = [
  { href: '/overview',  label: 'Visión general', icon: Home },
  { href: '/dashboard', label: 'Tareas diarias',  icon: CheckSquare },
  {
    label: 'Temas', icon: BookOpen, children: [
      { href: '/topics',    label: 'Todos los temas', icon: BookOpen },
      { href: '/mis-temas', label: 'Mis temas',       icon: ListChecks },
    ]
  },
  { href: '/medallero', label: 'Medallero',       icon: Trophy },
  { href: '/plan',      label: 'Mi plan',         icon: CalendarDays },
  { href: '/profile',   label: 'Perfil',          icon: User },
]

const mobileLinks: NavLink[] = nav.flatMap(item => 'children' in item ? item.children : [item])

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: attempts }] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).single(),
    supabase.from('level_attempts').select('completed_at').eq('student_id', user.id),
  ])

  const streak = computeStreak([...new Set((attempts ?? []).map((a) => format(new Date(a.completed_at), 'yyyy-MM-dd')))])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-muted/30 p-4">
        <Link href="/overview" className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            FQ
          </div>
          <span className="font-bold">Método FyQ</span>
        </Link>

        {streak > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-orange-50 px-3 py-2 mb-4 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-700">{streak}</span>
            <span className="text-orange-600 text-xs">{streak === 1 ? 'día de racha' : 'días de racha'}</span>
          </div>
        )}

        <nav className="flex-1 space-y-1">
          {nav.map(item => 'children' in item ? (
            <div key={item.label} className="pt-2">
              <div className="flex items-center gap-3 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
              {item.children.map(child => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-3 rounded-md pl-9 pr-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}

          {profile?.role === 'teacher' || profile?.role === 'admin' ? (
            <>
              <Separator className="my-2" />
              <Link
                href="/teacher"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Panel Profesor
              </Link>
            </>
          ) : null}
        </nav>

        <Separator className="my-4" />
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground px-3 truncate">
            {profile?.full_name ?? user.email}
          </p>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
          <Link href="/overview" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">FQ</div>
            <span className="font-bold">Método FyQ</span>
          </Link>
          <div className="flex gap-1">
            {mobileLinks.map(item => (
              <Link key={item.href} href={item.href} className="p-2 rounded-md hover:bg-accent">
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
