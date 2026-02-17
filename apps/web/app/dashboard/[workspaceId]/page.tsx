"use client";

import { ProjectsTable } from "./_components/projects-table";
import { useProjects } from "@/hooks/api/use-projects";
import { PageSpinner } from "@/components/page-spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;
  const { data, isLoading, error } = useProjects(workspaceId);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load projects", {
        description: error.message,
      });
    }
  }, [error]);

  if (isLoading) {
    return <PageSpinner />;
  }

  const projects = data?.data ?? [];

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Manage and track all your projects
        </p>
      </div>
      <ProjectsTable data={projects} />
    </>
  );
}
