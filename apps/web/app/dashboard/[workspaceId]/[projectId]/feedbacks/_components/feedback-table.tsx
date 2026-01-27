"use client";

import * as React from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { Feedback } from "@feedback/schema";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback } from "@feedback/ui/components/avatar";
import { Button } from "@feedback/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@feedback/ui/components/dropdown-menu";

interface FeedbackTableProps {
  data: Feedback[];
}

const statusConfig = {
  open: {
    color: "#3b82f6",
    label: "New",
  },
  "in-progress": {
    color: "#f59e0b",
    label: "In Progress",
  },
  completed: {
    color: "#10b981",
    label: "Done",
  },
  closed: {
    color: "#94a3b8",
    label: "Closed",
  },
} as const;

const defaultStatus = statusConfig.open;

function getInitials(name: string | null): string {
  if (!name || name === "Anonymous") return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusConfig(status: string): { color: string; label: string } {
  const config = statusConfig[status as keyof typeof statusConfig];
  return config || defaultStatus;
}

const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "title",
    header: "Feedback",
    cell: ({ row }) => {
      const feedback = row.original;

      return (
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-2">
          <h3 className="font-semibold leading-tight line-clamp-1 text-sm">
            {feedback.title}
          </h3>
          {feedback.description && (
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
              {feedback.description}
            </p>
          )}
        </div>
      );
    },
    minSize: 350,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getStatusConfig(row.getValue("status") as string);
      return (
        <div className="flex items-center py-2">
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
            style={{
              borderWidth: "1px",
              borderColor: `${status.color}20`,
              backgroundColor: `${status.color}08`,
            }}
          >
            <div
              className="size-1.5 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            {status.label}
          </div>
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => {
      const feedback = row.original;
      const customerName = feedback.customer_name || "Anonymous";
      const customerEmail = feedback.customer_email;

      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-xs font-medium">
              {getInitials(customerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium truncate">{customerName}</span>
            {customerEmail && (
              <span className="text-muted-foreground text-xs truncate">
                {customerEmail}
              </span>
            )}
          </div>
        </div>
      );
    },
    size: 220,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <div className="flex items-center py-2">
          <div className="text-muted-foreground text-sm">
            {getRelativeTime(createdAt)}
          </div>
        </div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex items-center justify-center py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted hover:bg-muted/50"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit feedback</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Change status</DropdownMenuItem>
              <DropdownMenuItem>Assign labels</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 60,
  },
];

export function FeedbackTable({ data }: FeedbackTableProps) {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        enableRowSelection={false}
        enablePagination={true}
      />
    </div>
  );
}
