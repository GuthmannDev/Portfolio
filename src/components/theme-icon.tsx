'use client'

import { useEffect, useState } from 'react'
import { LuSun, LuMoon, LuMonitor } from "react-icons/lu"

export function ThemeIcon({ theme }: { theme: string | undefined }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LuMonitor className="w-4 h-4" />
  }

  switch (theme) {
    case 'dark':
      return <LuMoon className="w-4 h-4" />;
    case 'light':
      return <LuSun className="w-4 h-4" />;
    default:
      return <LuMonitor className="w-4 h-4" />;
  }
}
