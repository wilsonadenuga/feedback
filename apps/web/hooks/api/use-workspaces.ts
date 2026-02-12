import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Workspace,
  CreateWorkspaceInput,
  SuccessResponse,
} from "@feedback/schema";
import { workspaceService } from "@/services/workspace.service";

export function useWorkspaces() {
  return useQuery<SuccessResponse<Workspace[]>, Error>({
    queryKey: ["workspaces"],
    queryFn: () => workspaceService.getWorkspaces(),
  });
}

export function useWorkspace(id: string) {
  return useQuery<SuccessResponse<Workspace>, Error>({
    queryKey: ["workspaces", id],
    queryFn: () => workspaceService.getWorkspace(id),
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) =>
      workspaceService.createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
