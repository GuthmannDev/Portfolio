'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LuHome, 
  LuFolderOpen, 
  LuUsers, 
  LuGlobe,
  LuMonitor,
  LuMoon,
  LuSun,
} from 'react-icons/lu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { SocialLinks } from './social-links';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { ThemeIcon } from './theme-icon';
import { GitHubAuthButton } from './auth/github-auth-button';

type Project = {
  id: number
  name: string
  description: string
  link: string
  github: string
}

export function DesktopNavbar({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const metadata = document.querySelector('meta[name="projects"]');
    if (metadata) {
      const projectData = JSON.parse(metadata.getAttribute('content') || '[]');
      setProjects(projectData);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="grid place-items-center fixed inset-x-0 top-4 z-50">
        <nav className={cn(
          'rounded-lg border',
          'bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30',
          'shadow-[0_0_15px_-3px_rgba(0,0,0,0.2),0_0_6px_-2px_rgba(0,0,0,0.15)]',
          'dark:shadow-[0_0_10px_-3px_rgba(255,255,255,0.05),0_0_4px_-2px_rgba(255,255,255,0.03)]',
          'p-4 text-[#121212] dark:text-[#eaeaea]',
          className
        )}>
          <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-8 place-items-center">
            <span className="text-xl font-bold">guthmann.dev</span>
            <Separator orientation="vertical" className="h-6 bg-[#121212]/20 dark:bg-[#eaeaea]/20" decorative />
            <div className="grid place-items-center">Loading...</div>
            <Separator orientation="vertical" className="h-6 bg-[#121212]/20 dark:bg-[#eaeaea]/20" decorative />
            <div className="grid place-items-center">
              <LuMonitor className="w-4 h-4" />
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <>
      <div className="grid place-items-center fixed inset-x-0 top-4 z-50">
        <nav className={cn(
          'rounded-lg border',
          'bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30',
          'shadow-[0_0_15px_-3px_rgba(0,0,0,0.2),0_0_6px_-2px_rgba(0,0,0,0.15)]',
          'dark:shadow-[0_0_10px_-3px_rgba(255,255,255,0.05),0_0_4px_-2px_rgba(255,255,255,0.03)]',
          'p-4 text-[#121212] dark:text-[#eaeaea]',
          isNavigating ? 'opacity-0 pointer-events-none' : 'opacity-100',
          'transition-opacity duration-200',
          className
        )}>
          <div className="grid grid-cols-[auto_min-content_auto_min-content_auto_min-content_auto] gap-2 place-items-center">
            <span className="text-xl font-bold">
              guthmann.dev
            </span>

            <div className="px-2">
              <Separator orientation="vertical" className="h-6 bg-[#121212]/20 dark:bg-[#eaeaea]/20" decorative />
            </div>

            <div className="w-full">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="grid grid-flow-col gap-6 justify-center">
                  <NavigationMenuItem className="grid place-items-center">
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="grid grid-cols-[auto_1fr] gap-2 place-items-center">
                        <LuHome className="w-4 h-4" />
                        <span className="text-sm font-medium">Home</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="grid place-items-center">
                    <NavigationMenuTrigger className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="grid grid-cols-[auto_1fr] gap-2 place-items-center">
                        <LuFolderOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Projects</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        {projects.map((project) => (
                          <Link 
                            key={project.id}
                            href={project.link}
                            target="_blank" 
                            rel="noreferrer noopener" 
                            className="grid grid-cols-[24px_1fr] gap-2 items-center hover:text-primary transition-colors"
                          >
                            <LuGlobe className="w-4 h-4" />
                            <span className="text-sm font-medium">{project.name}</span>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="grid place-items-center">
                    <Button
                      variant="ghost"
                      onClick={() => setSocialLinksOpen(true)}
                      className="grid grid-cols-[auto_1fr] gap-2 place-items-center hover:text-primary transition-colors p-0 h-auto"
                    >
                      <LuUsers className="w-4 h-4" />
                      <span className="text-sm font-medium">Connect</span>
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="px-2">
              <Separator orientation="vertical" className="h-6 bg-[#121212]/20 dark:bg-[#eaeaea]/20" decorative />
            </div>

            <div className="grid place-items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="grid place-items-center">
                    <NavigationMenuTrigger className="h-auto p-0 bg-transparent hover:bg-transparent">
                      <div className="grid place-items-center">
                        <ThemeIcon theme={theme} />
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        <Button
                          variant="ghost"
                          onClick={() => setTheme('light')}
                          className="grid grid-cols-[24px_1fr] gap-2 items-center hover:text-primary transition-colors w-full justify-start p-2 h-auto"
                        >
                          <LuSun className="w-4 h-4" />
                          <span className="text-sm font-medium">Light</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setTheme('dark')}
                          className="grid grid-cols-[24px_1fr] gap-2 items-center hover:text-primary transition-colors w-full justify-start p-2 h-auto"
                        >
                          <LuMoon className="w-4 h-4" />
                          <span className="text-sm font-medium">Dark</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setTheme('system')}
                          className="grid grid-cols-[24px_1fr] gap-2 items-center hover:text-primary transition-colors w-full justify-start p-2 h-auto"
                        >
                          <LuMonitor className="w-4 h-4" />
                          <span className="text-sm font-medium">System</span>
                        </Button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="px-2">
              <Separator orientation="vertical" className="h-6 bg-[#121212]/20 dark:bg-[#eaeaea]/20" decorative />
            </div>

            <div className="grid place-items-center">
              <GitHubAuthButton />
            </div>
          </div>
        </nav>
      </div>

      <Dialog 
        open={socialLinksOpen} 
        onOpenChange={setSocialLinksOpen}
      >
        <DialogContent>
          <DialogTitle>Connect with Me</DialogTitle>
          <SocialLinks />
        </DialogContent>
      </Dialog>
    </>
  );
}
