'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LuMenu,
  LuHome,
  LuFolderOpen,
  LuUsers,
  LuGlobe,
  LuChevronRight,
  LuSun,
  LuMoon,
  LuMonitor,
  LuChevronUp,
  LuChevronDown,
  LuLayoutDashboard
} from 'react-icons/lu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { usePathname, useSearchParams } from 'next/navigation';
import { SocialLinks } from './social-links';
import { useState, useEffect, useCallback, memo } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeIcon } from './theme-icon';
import { GitHubAuthButton } from './auth/github-auth-button';
import { useSession } from '@/hooks/use-session';

// Types
type Project = {
  id: number
  name: string
  description: string
  link: string
  github: string
}

type NavItemProps = {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

// Constants
const SHEET_WIDTHS = {
  default: 'w-[300px]',
  sm: 'sm:w-[400px]'
} as const;

const NAV_CLASSES = {
  base: [
    'fixed top-4 inset-x-4 z-50',
    'rounded-lg border',
    'bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30',
    'shadow-[0_0_15px_-3px_rgba(0,0,0,0.2),0_0_6px_-2px_rgba(0,0,0,0.15)]',
    'dark:shadow-[0_0_10px_-3px_rgba(255,255,255,0.05),0_0_4px_-2px_rgba(255,255,255,0.03)]',
    'py-4 px-6',
  ],
  navigating: 'opacity-0 pointer-events-none',
  visible: 'opacity-100',
  transition: 'transition-opacity duration-200',
} as const;

// Memoized Components
const NavItem = memo(({ href, icon, label, onClick }: NavItemProps) => {
  const Component = href ? Link : Button;
  const commonProps = {
    className: "grid grid-cols-[auto,1fr] gap-4 p-2 hover:bg-muted rounded-lg transition-colors group w-full text-left",
    onClick,
  };

  if (href) {
    return (
      <Component 
        href={href}
        {...commonProps}
      >
        <div className="grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </div>
        <span>{label}</span>
      </Component>
    );
  }

  return (
    <Button
      variant="ghost"
      {...commonProps}
    >
      <div className="grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <span>{label}</span>
    </Button>
  );
});

NavItem.displayName = 'NavItem';

const ProjectLink = memo(({ project, onClose }: { project: Project; onClose: () => void }) => (
  <Link
    href={project.link}
    target="_blank"
    rel="noreferrer noopener"
    onClick={onClose}
    className="grid grid-cols-[auto_1fr_auto] gap-4 p-2 hover:bg-muted rounded-lg transition-colors group"
  >
    <div className="grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
      <LuGlobe className="h-4 w-4" />
    </div>
    <span className="text-sm">{project.name}</span>
    <LuChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
  </Link>
));

ProjectLink.displayName = 'ProjectLink';

const ThemeDropdown = memo(({ theme, setTheme }: { theme: string | undefined; setTheme: (theme: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1" 
          aria-label="Change theme"
        >
          <ThemeIcon theme={theme} />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <LuChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="grid gap-2 p-3">
          <DropdownMenuItem 
            onClick={() => setTheme('light')} 
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <LuSun className="w-4 h-4" />
            <span className="text-sm font-medium">Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('dark')} 
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <LuMoon className="w-4 h-4" />
            <span className="text-sm font-medium">Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('system')} 
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <LuMonitor className="w-4 h-4" />
            <span className="text-sm font-medium">System</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ThemeDropdown.displayName = 'ThemeDropdown';

export function MobileNavbar({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { user } = useSession();

  const loadProjects = useCallback(() => {
    const metadata = document.querySelector('meta[name="projects"]');
    if (metadata) {
      try {
        const projectData = JSON.parse(metadata.getAttribute('content') || '[]');
        setProjects(projectData);
      } catch (error) {
        console.error('Failed to parse projects data:', error);
        setProjects([]);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  if (!mounted) {
    return (
      <nav className={cn(NAV_CLASSES.base, className)}>
        <div className="grid grid-cols-[1fr_auto] gap-8 items-center">
          <span className="text-xl font-bold">guthmann.dev</span>
          <div className="grid place-items-center">
            <LuMonitor className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn(
      NAV_CLASSES.base,
      isNavigating ? NAV_CLASSES.navigating : NAV_CLASSES.visible,
      NAV_CLASSES.transition,
      className
    )}>
      <div className="grid grid-cols-[1fr_auto] gap-8 items-center">
        <span className="text-xl font-bold">
          guthmann.dev
        </span>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="grid place-items-center"
              aria-label="Open navigation menu"
            >
              <LuMenu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn(SHEET_WIDTHS.default, SHEET_WIDTHS.sm, "flex flex-col p-0")}>
            <SheetHeader className="p-6">
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-2 px-4">
                <NavItem 
                  href="/"
                  icon={<LuHome className="h-4 w-4" aria-hidden="true" />}
                  label="Home"
                  onClick={() => setIsOpen(false)}
                />
                
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-auto w-full p-2 bg-transparent hover:bg-muted rounded-lg transition-colors">
                        <div className="grid grid-cols-[auto_1fr] gap-4 place-items-center">
                          <div className="grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                            <LuFolderOpen className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <span className="text-sm">Projects</span>
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-2 p-4">
                          {projects.map((project) => (
                            <ProjectLink 
                              key={project.id} 
                              project={project}
                              onClose={() => setIsOpen(false)} 
                            />
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                
                <NavItem 
                  icon={<LuUsers className="h-4 w-4" aria-hidden="true" />}
                  label="Connect"
                  onClick={() => {
                    setIsOpen(false);
                    setSocialLinksOpen(true);
                  }}
                />
              </div>
            </div>
          
            <div className="flex items-center justify-between gap-4 p-6 mt-auto">
              <GitHubAuthButton />
              <ThemeDropdown theme={theme} setTheme={setTheme} />
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={socialLinksOpen} onOpenChange={setSocialLinksOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Social Links</DialogTitle>
            </DialogHeader>
            <SocialLinks className="mt-4" />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
