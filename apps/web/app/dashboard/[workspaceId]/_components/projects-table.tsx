"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconDotsVertical, IconSearch } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";

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

export const projectSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const columns: ColumnDef<z.infer<typeof projectSchema>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, table }) => {
      const shortId = row.original.id.substring(0, 8);
      const workspaceId = (table.options.meta as any)?.workspaceId;
      return (
        <Link
          href={
            workspaceId
              ? `/dashboard/${workspaceId}/${row.original.id}/feedbacks`
              : "#"
          }
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
      const description = row.getValue("description") as string | null;
      return (
        <div className="text-muted-foreground max-w-md truncate">
          {description || "No description"}
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

export function ProjectsTable({
  data,
}: {
  data: z.infer<typeof projectSchema>[];
}) {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track all your projects
          </p>
        </div>
        <div className="relative max-w-sm">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        getRowId={(row) => row.id}
        meta={{ workspaceId }}
        enableRowSelection={false}
        enablePagination={false}
      />
    </div>
  );
}
