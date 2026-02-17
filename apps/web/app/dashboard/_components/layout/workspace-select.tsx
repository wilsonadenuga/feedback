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

import { CreateWorkspaceDialog } from "../workspace/create-workspace-dialog";
import { useDashboardSelection } from "./dashboard-selection-provider";

export function WorkspaceSelect() {
  const router = useRouter();
  const { workspaceId, workspaces, selectedWorkspace, setWorkspace } =
    useDashboardSelection();

  return (
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
          className="block px-2 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
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
                  workspace.id === workspaceId ? "opacity-100" : "opacity-0"
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
  );
}
