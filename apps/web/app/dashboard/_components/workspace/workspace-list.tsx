import { Workspace } from "@feedback/schema";
import { WorkspaceCard } from "./workspace-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@feedback/ui/components/card";
import { IconPlus } from "@tabler/icons-react";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

export const WorkspaceList = ({ workspaces }: { workspaces: Workspace[] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
      <CreateWorkspaceDialog
        trigger={
          <button type="button" className="w-full text-left">
            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Create Workspace
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Start a new workspace
                    </CardDescription>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors group-hover:border-primary/60 group-hover:text-primary">
                    <IconPlus className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Set up a new workspace for your team or project
                </p>
              </CardContent>
            </Card>
          </button>
        }
      />
    </div>
  );
};
