"use client";

import * as React from "react";
import { IconSearch } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { WorkspaceInvite } from "@feedback/schema";
import { DataTable } from "@/components/data-table";
import { Badge } from "@feedback/ui/components/badge";
import { Button } from "@feedback/ui/components/button";
import { Input } from "@feedback/ui/components/input";

const columns: ColumnDef<WorkspaceInvite>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      return <div className="font-medium">{email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColors: Record<string, "default" | "secondary" | "outline"> = {
        admin: "destructive" as "default",
        member: "default",
        viewer: "secondary",
      };
      return (
        <Badge variant={roleColors[role] || "outline"}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<
        string,
        "default" | "secondary" | "outline" | "destructive"
      > = {
        PENDING: "secondary",
        ACCEPTED: "default",
        REVOKED: "destructive",
        EXPIRED: "outline",
      };
      return (
        <Badge variant={statusColors[status] || "outline"}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Invited",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
];

interface InvitesTableProps {
  data: WorkspaceInvite[];
}

export function InvitesTable({ data }: InvitesTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((invite) =>
      invite.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search invites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>Invite member</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        getRowId={(row) => row.id}
        enableRowSelection={false}
        enablePagination={false}
      />
    </div>
  );
}
