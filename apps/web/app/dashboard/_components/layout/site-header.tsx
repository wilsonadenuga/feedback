"use client";

import {
  IconCheck,
  IconChevronDown,
  IconLogout,
  IconPlus,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@feedback/ui/components/avatar";
import { Button } from "@feedback/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@feedback/ui/components/dropdown-menu";
import { Separator } from "@feedback/ui/components/separator";
import { SidebarTrigger } from "@feedback/ui/components/sidebar";
import { Skeleton } from "@feedback/ui/components/skeleton";
import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDashboardSelection } from "./dashboard-selection-provider";
import { CreateProjectDialog } from "../project/create-project-dialog";
import { CreateWorkspaceDialog } from "../workspace/create-workspace-dialog";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    workspaceId,
    workspaces,
    projects,
    selectedWorkspace,
    selectedProject,
    isLoadingWorkspaces,
    isLoadingProjects,
    setWorkspace,
    setProject,
  } = useDashboardSelection();
  const isWorkspaceSelectionScreen = !workspaceId;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          {isWorkspaceSelectionScreen || isLoadingWorkspaces ? (
            <>
              <Skeleton className="h-8 w-36 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span className="font-medium">
                      {selectedWorkspace?.name || "Select workspace"}
                    </span>
                    <IconChevronDown className="size-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <Link
                    href="/dashboard"
                    className="block text-[10px] font-medium tracking-wide uppercase text-muted-foreground px-2 py-1 hover:text-foreground"
                  >
                    Workspace
                  </Link>
                  <DropdownMenuSeparator />
                  {workspaces.length === 0 ? (
                    <DropdownMenuItem disabled className="text-xs">
                      No workspaces
                    </DropdownMenuItem>
                  ) : (
                    workspaces.map((workspace) => (
                      <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => setWorkspace(workspace.id)}
                        className="text-xs justify-between"
                      >
                        <span>{workspace.name}</span>
                        <IconCheck
                          className={`size-3.5 ${
                            workspace.id === workspaceId
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <CreateWorkspaceDialog
                    onCreated={(workspace) => {
                      router.push(`/dashboard/${workspace.id}`);
                    }}
                    trigger={
                      <DropdownMenuItem
                        onSelect={(event) => event.preventDefault()}
                        className="text-xs justify-between"
                      >
                        <span>Create workspace</span>
                        <IconPlus className="size-3.5" />
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              {workspaceId && selectedProject && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span className="font-medium">
                        {selectedProject.name}
                      </span>
                      <IconChevronDown className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <Link
                      href={`/dashboard/${workspaceId}`}
                      className="block text-[10px] font-medium tracking-wide uppercase text-muted-foreground px-2 py-1 hover:text-foreground"
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
                              project.id === selectedProject.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <CreateProjectDialog
                      workspaceId={workspaceId}
                      onCreated={(project) => {
                        router.push(
                          `/dashboard/${workspaceId}/projects/${project.id}/feedbacks`,
                        );
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
              )}
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <a href="#" className="dark:text-foreground">
              API Docs
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-1">
                <Avatar className="size-6">
                  <AvatarFallback>
                    {user ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.name || "User"}</span>
                <IconChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {user ? getUserInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-sm font-medium">
                      {user?.name || "User"}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {user?.email || "user@example.com"}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconUserCircle className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSettings className="size-4" />
                Settings
              </DropdownMenuItem>
              <ThemeToggle />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <IconLogout className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
