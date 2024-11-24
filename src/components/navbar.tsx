'use client';

import { useEffect, useState } from 'react';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

function useDeviceType() {
  // Initialize with null to avoid hydration mismatch
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Return true (desktop) as default during SSR
  return isDesktop ?? true;
}

export function Navbar() {
  const isDesktop = useDeviceType();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <nav className="h-16" />;
  }

  return (
    <>
      {isDesktop ? <DesktopNavbar /> : <MobileNavbar />}
    </>
  );
}
