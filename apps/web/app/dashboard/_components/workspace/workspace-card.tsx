import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@feedback/ui/components/card";
import { Badge } from "@feedback/ui/components/badge";
import { IconChevronRight } from "@tabler/icons-react";
import { Workspace } from "@feedback/schema";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {workspace.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Created{" "}
                {new Date(workspace.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardDescription>
            </div>
            <IconChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {10} projects
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {10} members
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
