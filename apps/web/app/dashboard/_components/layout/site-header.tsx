"use client";

import {
  IconChevronDown,
  IconLogout,
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
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";

import { useDashboardSelection } from "./dashboard-selection-provider";
import { ProjectSelect } from "./project-select";
import { ThemeToggle } from "./theme-toggle";
import { WorkspaceSelect } from "./workspace-select";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { workspaceId, isLoadingWorkspaces } = useDashboardSelection();
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
          {!isWorkspaceSelectionScreen && !isLoadingWorkspaces ? (
            <>
              <WorkspaceSelect />
              <ProjectSelect />
            </>
          ) : null}
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
                      {user?.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {user?.email}
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
