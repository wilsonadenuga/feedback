"use client";

import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { Button } from "@feedback/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@feedback/ui/components/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CreateProjectDialog } from "../project/create-project-dialog";
import { useDashboardSelection } from "./dashboard-selection-provider";

export function ProjectSelect() {
  const router = useRouter();
  const { workspaceId, projects, selectedProject, isLoadingProjects, setProject } =
    useDashboardSelection();

  if (!workspaceId || !selectedProject) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <span className="font-medium">{selectedProject.name}</span>
          <IconChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <Link
          href={`/dashboard/${workspaceId}`}
          className="block px-2 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
        >
          Project
        </Link>
        <DropdownMenuSeparator />
        {isLoadingProjects ? (
          <DropdownMenuItem disabled className="text-xs">
            Loading projects...
          </DropdownMenuItem>
        ) : projects.length === 0 ? (
          <DropdownMenuItem disabled className="text-xs">
            No projects
          </DropdownMenuItem>
        ) : (
          projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => setProject(project.id)}
              className="text-xs justify-between"
            >
              <span>{project.name}</span>
              <IconCheck
                className={`size-3.5 ${
                  project.id === selectedProject.id ? "opacity-100" : "opacity-0"
                }`}
              />
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <CreateProjectDialog
          workspaceId={workspaceId}
          onCreated={(project) => {
            router.push(`/dashboard/${workspaceId}/projects/${project.id}/feedbacks`);
          }}
          trigger={
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="text-xs justify-between"
            >
              <span>Create project</span>
              <IconPlus className="size-3.5" />
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
