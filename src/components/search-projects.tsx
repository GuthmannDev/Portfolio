'use client';

import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { Button } from "@/components/ui/button";

type Project = {
  id: number;
  name: string;
  description: string;
  link: string;
  github: string;
};

export function SearchProjects() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button
      variant="ghost"
      onClick={() => setIsOpen(true)}
      className="grid grid-cols-[auto,1fr] gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <LuSearch className="w-4 h-4" />
      <span>Search Projects</span>
    </Button>
  );
}
