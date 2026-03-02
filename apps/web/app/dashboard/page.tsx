"use client";

import { Button } from "@feedback/ui/components/button";
import { IconPlus } from "@tabler/icons-react";
import { useWorkspaces } from "@/hooks/api/use-workspaces";
import { EmptyState } from "@/components/empty-state";
import { PageSpinner } from "@/components/page-spinner";
import { toast } from "sonner";
import { useEffect } from "react";
import { WorkspaceList } from "./_components/workspace/workspace-list";
import { CreateWorkspaceDialog } from "./_components/workspace/create-workspace-dialog";

export default function DashboardPage() {
  const { data, isLoading, error } = useWorkspaces();

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

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Your Workspaces
        </h1>
        <p className="text-muted-foreground">
          Select a workspace to continue or create a new one
        </p>
      </div>

      {workspaces.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <EmptyState
            title="No workspaces yet"
            description="Get started by creating your first workspace to organize your projects and collaborate with your team."
            action={
              <div className="flex gap-2">
                <CreateWorkspaceDialog
                  trigger={
                    <Button>
                      <IconPlus className="h-4 w-4 mr-2" />
                      Create Workspace
                    </Button>
                  }
                />
              </div>
            }
          />
        </div>
      ) : (
        <WorkspaceList workspaces={workspaces} />
      )}
    </>
  );
}
