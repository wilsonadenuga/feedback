import { useQuery } from "@tanstack/react-query";
import { Project, SuccessResponse } from "@feedback/schema";
import { projectService } from "@/services/project.service";

export function useProjects(workspaceId?: string) {
  return useQuery<SuccessResponse<Project[]>, Error>({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getProjects(workspaceId as string),
    enabled: !!workspaceId,
  });
}
