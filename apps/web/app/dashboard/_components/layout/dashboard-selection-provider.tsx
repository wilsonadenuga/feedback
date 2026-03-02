"use client";

import * as React from "react";
import { Project, Workspace } from "@feedback/schema";
import { useParams, useRouter } from "next/navigation";

import { useProjects } from "@/hooks/api/use-projects";
import { useWorkspaces } from "@/hooks/api/use-workspaces";

type DashboardSelectionContextValue = {
  workspaceId?: string;
  projectId?: string;
  workspaces: Workspace[];
  projects: Project[];
  selectedWorkspace?: Workspace;
  selectedProject?: Project;
  isLoadingWorkspaces: boolean;
  isLoadingProjects: boolean;
  setWorkspace: (nextWorkspaceId: string) => void;
  setProject: (nextProjectId: string) => void;
};

const DashboardSelectionContext =
  React.createContext<DashboardSelectionContextValue | null>(null);

export function DashboardSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();

  const workspaceId = params?.workspaceId as string | undefined;
  const projectId = params?.projectId as string | undefined;

  const { data: workspaceData, isLoading: isLoadingWorkspaces } =
    useWorkspaces();
  const { data: projectData, isLoading: isLoadingProjects } =
    useProjects(workspaceId);

  const workspaces = React.useMemo(
    () => workspaceData?.data ?? [],
    [workspaceData?.data],
  );
  const projects = React.useMemo(
    () => projectData?.data ?? [],
    [projectData?.data],
  );

  const selectedWorkspace = React.useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId),
    [workspaces, workspaceId],
  );
  const selectedProject = React.useMemo(
    () => projects.find((project) => project.id === projectId),
    [projects, projectId],
  );

  const setWorkspace = React.useCallback(
    (nextWorkspaceId: string) => {
      router.push(`/dashboard/${nextWorkspaceId}`);
    },
    [router],
  );

  const setProject = React.useCallback(
    (nextProjectId: string) => {
      if (!workspaceId) return;
      router.push(`/dashboard/${workspaceId}/projects/${nextProjectId}/feedbacks`);
    },
    [router, workspaceId],
  );

  const value = React.useMemo<DashboardSelectionContextValue>(
    () => ({
      workspaceId,
      projectId,
      workspaces,
      projects,
      selectedWorkspace,
      selectedProject,
      isLoadingWorkspaces,
      isLoadingProjects,
      setWorkspace,
      setProject,
    }),
    [
      workspaceId,
      projectId,
      workspaces,
      projects,
      selectedWorkspace,
      selectedProject,
      isLoadingWorkspaces,
      isLoadingProjects,
      setWorkspace,
      setProject,
    ],
  );

  return (
    <DashboardSelectionContext.Provider value={value}>
      {children}
    </DashboardSelectionContext.Provider>
  );
}

export function useDashboardSelection() {
  const context = React.useContext(DashboardSelectionContext);

  if (!context) {
    throw new Error(
      "useDashboardSelection must be used within DashboardSelectionProvider",
    );
  }

  return context;
}
