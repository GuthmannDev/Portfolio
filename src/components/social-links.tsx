"use client"

import { LuGithub, LuMessageSquare, LuMail } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContactForm } from "./contact-form"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  const [contactFormOpen, setContactFormOpen] = useState(false)

  return (
    <>
      <div className={cn("grid gap-3", className)}>
        <Button
          variant="outline"
          className="w-full h-auto p-4"
          asChild
        >
          <a
            href="https://github.com/GuthmannDev"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline grid grid-cols-[auto_1fr] items-center gap-4"
          >
            <LuGithub className="h-5 w-5" />
            <div className="grid gap-1 text-left min-w-0">
              <div className="font-medium truncate">GitHub</div>
              <div className="text-sm text-muted-foreground truncate">
                Check out my open source projects
              </div>
            </div>
          </a>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4"
          asChild
        >
          <a
            href="https://discord.com/users/504014438383222804"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline grid grid-cols-[auto_1fr] items-center gap-4"
          >
            <LuMessageSquare className="h-5 w-5" />
            <div className="grid gap-1 text-left min-w-0">
              <div className="font-medium truncate">Discord</div>
              <div className="text-sm text-muted-foreground truncate">
                Connect with me over discord
              </div>
            </div>
          </a>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4"
          onClick={() => setContactFormOpen(true)}
        >
          <div className="no-underline grid grid-cols-[auto_1fr] items-center gap-4 w-full">
            <LuMail className="h-5 w-5" />
            <div className="grid gap-1 text-left min-w-0">
              <div className="font-medium truncate">Email</div>
              <div className="text-sm text-muted-foreground truncate">
                Send me a direct message
              </div>
            </div>
          </div>
        </Button>
      </div>

      <Dialog modal={false} open={contactFormOpen} onOpenChange={setContactFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Me</DialogTitle>
          </DialogHeader>
          <ContactForm onSubmit={() => setContactFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
