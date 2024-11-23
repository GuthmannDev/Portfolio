'use client'

import { LuFileText } from 'react-icons/lu'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { ImprintDialog } from './imprint-dialog'

export function LegalButton() {
  const [showImprint, setShowImprint] = useState(false)

  return (
    <div className="w-full flex justify-end items-end fixed bottom-0 p-4 z-50">
      <ImprintDialog open={showImprint} onOpenChange={setShowImprint} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30 shadow-[0_0_15px_-3px_rgba(0,0,0,0.2),0_0_6px_-2px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_-3px_rgba(255,255,255,0.05),0_0_4px_-2px_rgba(255,255,255,0.03)]">
            <LuFileText className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuItem onSelect={() => setShowImprint(true)}>
            Imprint
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
