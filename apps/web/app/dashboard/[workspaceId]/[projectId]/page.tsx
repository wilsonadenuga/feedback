export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = await params;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Project Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Workspace: {workspaceId} / Project: {projectId}
        </p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Project overview page - Coming soon
        </p>
      </div>
    </>
  );
}
