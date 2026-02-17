"use client";

import * as React from "react";
import Link from "next/link";
import { IconDotsVertical, IconSearch } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { Project } from "@feedback/schema";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { Button } from "@feedback/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@feedback/ui/components/dropdown-menu";
import { Input } from "@feedback/ui/components/input";

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const shortId = row.original.id.substring(0, 8);
      const workspaceId = row.original.workspace_id;
      return (
        <Link
          href={`/dashboard/${workspaceId}/${row.original.id}/feedbacks`}
          className="flex flex-col gap-0.5 hover:underline"
        >
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-muted-foreground text-xs">{shortId}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground max-w-md truncate">
          {row.original.description || "No description provided"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(project.id);
                toast.success("Project ID copied to clipboard");
              }}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Project settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProjectsTable({ data }: { data: Project[] }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <>
      <div className="relative max-w-sm">
        <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        enableRowSelection={false}
        enablePagination={false}
      />
    </>
  );
}
