import { Project, SuccessResponse } from "@feedback/schema";
import { apiClient } from "@/lib/api-client";

export const projectService = {
  getProjects: (workspaceId: string): Promise<SuccessResponse<Project[]>> => {
    return apiClient.get(
      `/v1/projects?workspace_id=${encodeURIComponent(workspaceId)}`,
      {
        authenticated: true,
      },
    );
  },
};
