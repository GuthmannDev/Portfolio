import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LuGlobe, LuGithub } from "react-icons/lu"

interface ProjectCardProps {
  name: string
  description: string
  link: string
  github: string
}

export function ProjectCard({ name, description, link, github }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            asChild
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-cols-[auto_1fr] gap-2 place-items-center"
            >
              <LuGlobe className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            asChild
          >
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-cols-[auto_1fr] gap-2 place-items-center"
            >
              <LuGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
