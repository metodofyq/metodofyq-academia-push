'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MobileNavProps {
  navItems: Array<{
    href?: string
    label: string
    icon: React.ReactNode
    children?: Array<{
      href: string
      label: string
      icon: React.ReactNode
    }>
  }>
  userName?: string
  isTeacher?: boolean
}

export function MobileNav({ navItems, userName, isTeacher }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const allLinks = navItems.flatMap(item =>
    item.children ?? (item.href ? [{ href: item.href, label: item.label, icon: item.icon }] : [])
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-md hover:bg-accent"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-background border-r shadow-lg overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/overview"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    FQ
                  </div>
                  <span className="font-bold">Método FyQ</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map(item => {
                  if (item.children) {
                    return (
                      <div key={item.label} className="pt-2">
                        <div className="flex items-center gap-3 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {item.icon}
                          {item.label}
                        </div>
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 rounded-md pl-9 pr-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href || '#'}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                })}

                {isTeacher && (
                  <>
                    <Separator className="my-2" />
                    <Link
                      href="/teacher"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>📊</span>
                      Panel Profesor
                    </Link>
                  </>
                )}
              </nav>

              <Separator className="my-4" />

              {/* User info and logout */}
              <div className="space-y-2">
                {userName && (
                  <p className="text-xs text-muted-foreground px-3 truncate">
                    {userName}
                  </p>
                )}
                <form action="/auth/signout" method="post">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
