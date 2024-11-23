'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Favicon() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      favicon.href = resolvedTheme === 'dark' 
        ? '/guthmann.dev-light.svg' 
        : '/guthmann.dev-dark.svg'
      favicon.type = 'image/svg+xml'
    }
  }, [resolvedTheme, mounted])

  return null
}
