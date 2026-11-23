import { ChevronDown, LogOut, Moon, Star, Sun } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../api/auth'
import { useLogout } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Avatar from './Avatar'

const ITEM =
  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:bg-slate-800 focus-visible:text-white'

/**
 * The avatar button and its dropdown, built to the standard "menu button" keyboard pattern:
 * - Click, Enter, Space or Arrow Down opens it and moves focus to the first item.
 * - Arrow Up/Down, Home and End move between items.
 * - Escape closes it and puts focus back on the avatar. Tab and clicking elsewhere also close it.
 */
export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const logout = useLogout()
  const { theme, toggle: toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const ThemeIcon = theme === 'dark' ? Sun : Moon

  // Only items that are actually visible count (the theme item is hidden on desktop).
  const getItems = (): HTMLElement[] =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter((el) => el.offsetParent !== null)

  // When the menu opens, focus the first item.
  useEffect(() => {
    if (open) getItems()[0]?.focus()
  }, [open])

  // Clicking anywhere outside closes the menu.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault()
      close(true)
      return
    }
    // Arrow Down/Up on the closed button opens the menu.
    if (!open && e.target === buttonRef.current && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open || !menuRef.current?.contains(e.target as Node)) return

    const items = getItems()
    const index = items.indexOf(document.activeElement as HTMLElement)
    const move = (to: number) => {
      e.preventDefault()
      items[(to + items.length) % items.length]?.focus()
    }
    if (e.key === 'ArrowDown') move(index + 1)
    else if (e.key === 'ArrowUp') move(index - 1)
    else if (e.key === 'Home') move(0)
    else if (e.key === 'End') move(items.length - 1)
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      // Focus moving away (for example with Tab) closes the menu.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full p-0.5 transition hover:bg-slate-800"
      >
        <Avatar name={user.name} />
        {/* The button's name. (An aria-label would not match the visible initials, which breaks voice control.) */}
        <span className="sr-only">Account menu for {user.name}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`hidden text-slate-400 transition md:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        // tabIndex -1 lets clicks inside the panel keep focus here instead of closing the menu.
        <div
          id={menuId}
          tabIndex={-1}
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-800 bg-surface p-1.5 shadow-xl outline-none"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <div role="separator" className="my-1 h-px bg-slate-800" />
          <div ref={menuRef} role="menu" aria-label="Account">
            <Link to="/dashboard" role="menuitem" tabIndex={-1} onClick={() => close(false)} className={ITEM}>
              <Star size={16} aria-hidden="true" />
              My teams
            </Link>
            {/* On desktop the theme button lives in the header; on mobile it is only here. */}
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                toggleTheme()
                close(true)
              }}
              className={`${ITEM} md:hidden`}
            >
              <ThemeIcon size={16} aria-hidden="true" />
              Switch to {nextTheme} theme
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={logout.isPending}
              onClick={() => {
                logout.mutate()
                close(false)
              }}
              className={ITEM}
            >
              <LogOut size={16} aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
