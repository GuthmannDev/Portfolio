'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LuCopy, LuExternalLink } from "react-icons/lu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "./ui/dropdown-menu"

interface ImprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImprintDialog({ open, onOpenChange }: ImprintDialogProps) {
  const { toast } = useToast()
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: `${label} copied to clipboard`,
      })
    })
  }

  return (<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Imprint</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Maximilian Guthmann</h3>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-lg font-medium text-muted-foreground">Contact</h4>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <p><span className="font-medium">Email:</span> <a href="mailto:max@guthmann.dev" className="text-primary underline">max@guthmann.dev</a></p>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => copyToClipboard("max@guthmann.dev", "Email")}
              >
                <LuCopy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <p><span className="font-medium">Phone:</span> <a href="tel:+4917676715851" className="text-primary underline">+49 176 76715851</a></p>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => copyToClipboard("+4917676715851", "Phone number")}
              >
                <LuCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium text-muted-foreground">Address</h4>
          <div className="flex items-start gap-2">
            <div className="grid gap-1">
              <p>Maximilian Guthmann</p>
              <p>Obenitterstraße 60</p>
              <p>42719 Solingen</p>
              <p>Deutschland</p>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => copyToClipboard("Obenitterstraße 60\n42719 Solingen\nDeutschland", "Address")}
              >
                <LuCopy className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <LuExternalLink className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Obenitterstraße+60+42719+Solingen+Deutschland" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <LuExternalLink className="mr-2 h-4 w-4" />
                      Google Maps
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a 
                      href="https://www.openstreetmap.org/search?query=Obenitterstraße%2060%2042719%20Solingen%20Deutschland" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <LuExternalLink className="mr-2 h-4 w-4" />
                      OpenStreetMap
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}