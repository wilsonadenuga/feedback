"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@feedback/ui/components/card";
import { Button } from "@feedback/ui/components/button";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useWorkspaces } from "@/hooks/api/use-workspaces";
import { EmptyState } from "@/components/empty-state";
import { PageSpinner } from "@/components/page-spinner";
import { WorkspaceCard } from "./_components/workspace/workspace-card";
import { toast } from "sonner";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useWorkspaces();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load workspaces", {
        description: error.message,
      });
    }
  }, [error]);

  if (isLoading) {
    return <PageSpinner />;
  }

  const workspaces = data?.data || [];

  if (error || workspaces.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title={error ? "Unable to load workspaces" : "No workspaces yet"}
          description={
            error
              ? "There was a problem loading your workspaces. Please try again."
              : "Get started by creating your first workspace to organize your projects and collaborate with your team."
          }
          action={
            <div className="flex gap-2">
              {error && (
                <Button variant="outline" onClick={() => refetch()}>
                  <IconRefresh className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
              <Button>
                <IconPlus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </div>
          }
        />
      </div>
    );
  }
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
        <p className="text-muted-foreground">
          Select a workspace to continue or create a new one
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                <IconPlus className="h-5 w-5 inline-block mr-2" />
                Create Workspace
              </CardTitle>
              <CardDescription className="text-xs">
                Start a new workspace
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Set up a new workspace for your team or project
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
