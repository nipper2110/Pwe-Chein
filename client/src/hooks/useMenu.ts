import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'

/**
 * Everything a "menu button" needs, shared by the avatar menu and the language menu:
 * - Click, Enter, Space or Arrow Down/Up on the button opens it and focuses an item
 *   (the checked item if there is one, otherwise the first).
 * - Arrow Up/Down, Home and End move between items (wrapping around).
 * - Escape closes it and puts focus back on the button.
 * - Tab, or clicking anywhere outside, also closes it.
 * Items are any elements with role="menuitem" or role="menuitemradio" inside the menu element.
 */
export function useMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  // Only items that are actually visible count (some items are hidden at certain screen sizes).
  const getItems = (): HTMLElement[] =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemradio"]') ?? []).filter(
      (el) => el.offsetParent !== null,
    )

  // When the menu opens, focus the checked item (the current language, say) or else the first one.
  useEffect(() => {
    if (!open) return
    const items = getItems()
    ;(items.find((el) => el.getAttribute('aria-checked') === 'true') ?? items[0])?.focus()
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

  // Focus moving away (for example with Tab) closes the menu.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
  }

  return { open, setOpen, close, rootRef, buttonRef, menuRef, menuId, rootProps: { onKeyDown, onBlur } }
}
