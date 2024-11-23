'use client';

import { useEffect, useState } from 'react';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

function useDeviceType() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
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

  return isDesktop;
}

export function Navbar() {
  const isDesktop = useDeviceType();

  return (
    <>
      {isDesktop ? <DesktopNavbar /> : <MobileNavbar />}
    </>
  );
}
