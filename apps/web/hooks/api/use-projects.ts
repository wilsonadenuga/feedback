import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProjectInput, Project, SuccessResponse } from "@feedback/schema";
import { projectService } from "@/services/project.service";

export function useProjects(workspaceId?: string) {
  return useQuery<SuccessResponse<Project[]>, Error>({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getProjects(workspaceId as string),
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
