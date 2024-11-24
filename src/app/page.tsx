'use client'

import React, { useState, memo } from 'react'
import { 
  SiTypescript,
  SiBun,
  SiKotlin,
  SiJavascript,
  SiNodedotjs,
  SiSupabase,
  SiPostgresql,
  SiDrizzle,
  SiArchlinux,
  SiGit,
  SiNextdotjs,
  SiSolid,
  SiVuedotjs,
} from 'react-icons/si'
import { FaJava, FaRegPaperPlane, FaChevronDown } from 'react-icons/fa6'
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { calculateDates } from '@/lib/date-utils'
import ReactEmojis from "@souhaildev/reactemojis"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ImprintDialog from '@/components/imprint-dialog'

interface TechStackLinkProps {
  href: string
  iconColor: string
  icon: React.ReactNode
}

const TechStackLink = memo(function TechStackLink({ href, iconColor, icon }: TechStackLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 shadow-sm hover:shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 ease-in-out group hover:scale-110 hover:z-10"
      style={{ '--icon-color': iconColor } as React.CSSProperties}
      aria-label={`View ${href.replace('https://', '').split('/')[0]}`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-6 h-6 transition-colors duration-300 group-hover:text-[var(--icon-color)]",
        'aria-hidden': true
      })}
    </Link>
  )
})

export default function Home() {
  const [showImprint, setShowImprint] = useState(false)
  const {birthday, experience} = calculateDates()

  return (
    <div className="flex flex-col w-full">
      <ImprintDialog open={showImprint} onOpenChange={setShowImprint} />
      <section className="min-h-screen flex items-center py-16 md:py-0">
        <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 gap-8 py-8 md:py-0">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <div className="flex items-center gap-2 md:justify-start">
                  Hi, I'm Max <span className="-translate-y-2"><ReactEmojis emoji="👋" emojiStyle='2' style={{ height: 75, width: 75 }} /></span>
                </div>
              </h1>
              <p className="text-xl text-muted-foreground">
                A passionate developer focused on creating impactful web experiences which are privacy focused.
              </p>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-semibold">About Me</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    I'm a passionate software developer based in Germany, constantly learning and exploring <Link href="https://en.wikipedia.org/wiki/Free_and_open-source_software" target="_blank" rel="noopener noreferrer" className="text-primary underline">Free and (Libre) Open Source Software</Link>. I'm also a <Link href="https://github.com/GuthmannDev" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub Organization</Link> on GitHub. Currently I don't have any projects that are actively maintained, but I have something very big planned.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I am mainly using F(L)OSS Apps/Software, and if a App is not F(L)OSS, I will only use it if it has a good privacy policy, or else I will search for an alternative. I am also using <Link href="https://calyxos.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline">CalyxOS</Link>. So as you can see I am very privacy focused.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px]">Age:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="text-muted-foreground text-left justify-start h-auto px-2 py-1 font-normal"
                        >
                          <span>{birthday.age} years</span>
                          <FaChevronDown className="h-3 w-3 ml-2 opacity-50" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem className="flex flex-col items-start gap-1">
                          <div className="font-medium">Next Birthday</div>
                          <div className="text-sm text-muted-foreground">
                            {birthday.remainingDays} days and {birthday.remainingMonths} months until I'm {birthday.age + 1}
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px]">Based in:</span>
                    <span className="text-muted-foreground px-2 py-1">Germany</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px]">Experience:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="text-muted-foreground text-left justify-start h-auto px-2 py-1 font-normal"
                        >
                          <span>{experience.jre} years</span>
                          <FaChevronDown className="h-3 w-3 ml-2 opacity-50" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem className="flex flex-col items-start gap-1">
                          <div className="font-medium">Minecraft Plugins</div>
                          <div className="text-sm text-muted-foreground">{experience.jre} years of Minecraft plugin development</div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1">
                          <div className="font-medium">Backend Development</div>
                          <div className="text-sm text-muted-foreground">{experience.backend} years of web backend development</div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <div className="grid grid-cols-3 gap-4">
                  <TechStackLink
                    href="https://www.typescriptlang.org"
                    iconColor="#3178C6"
                    icon={<SiTypescript />}
                  />
                  <TechStackLink
                    href="https://javascript.info"
                    iconColor="#D4AF37"
                    icon={<SiJavascript />}
                  />
                  <TechStackLink
                    href="https://kotlinlang.org"
                    iconColor="#7F52FF"
                    icon={<SiKotlin />}
                  />
                  <TechStackLink
                    href="https://nodejs.org"
                    iconColor="#339933"
                    icon={<SiNodedotjs />}
                  />
                  <TechStackLink
                    href="https://bun.sh"
                    iconColor="#FBF0DF"
                    icon={<SiBun />}
                  />
                  <TechStackLink
                    href="https://www.java.com"
                    iconColor="#007396"
                    icon={<FaJava />}
                  />
                  <TechStackLink
                    href="https://www.solidjs.com/"
                    iconColor="#2C4F7C"
                    icon={<SiSolid />}
                  />
                  <TechStackLink
                    href="https://nextjs.org/"
                    iconColor="#000000"
                    icon={<SiNextdotjs />}
                  />
                  <TechStackLink
                    href="https://vuejs.org/"
                    iconColor="#4FC08D"
                    icon={<SiVuedotjs />}
                  />
                  <TechStackLink
                    href="https://supabase.com"
                    iconColor="#3ECF8E"
                    icon={<SiSupabase />}
                  />
                  <TechStackLink
                    href="https://orm.drizzle.team/"
                    iconColor="#C5F74F"
                    icon={<SiDrizzle />}
                  />
                  <TechStackLink
                    href="https://www.postgresql.org"
                    iconColor="#336791"
                    icon={<SiPostgresql />}
                  />
                  <TechStackLink
                    href="https://git-scm.com/"
                    iconColor="#F05032"
                    icon={<SiGit />}
                  />
                  <TechStackLink
                    href="https://archlinux.org/"
                    iconColor="#1793D1"
                    icon={<SiArchlinux />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
