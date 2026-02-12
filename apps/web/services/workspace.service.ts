import {
  Workspace,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  SuccessResponse,
} from "@feedback/schema";
import { apiClient } from "@/lib/api-client";

export const workspaceService = {
  getWorkspaces: (): Promise<SuccessResponse<Workspace[]>> => {
    return apiClient.get("/v1/workspaces", { authenticated: true });
  },

  createWorkspace: (
    data: CreateWorkspaceInput,
  ): Promise<SuccessResponse<Workspace>> => {
    return apiClient.post("/v1/workspaces", data, { authenticated: true });
  },

  getWorkspace: (id: string): Promise<SuccessResponse<Workspace>> => {
    return apiClient.get(`/v1/workspaces/${id}`, { authenticated: true });
  },

  updateWorkspace: (
    id: string,
    data: UpdateWorkspaceInput,
  ): Promise<SuccessResponse<Workspace>> => {
    return apiClient.post(`/v1/workspaces/${id}`, data, {
      authenticated: true,
    });
  },

  deleteWorkspace: (id: string): Promise<SuccessResponse<null>> => {
    return apiClient.post(`/v1/workspaces/${id}`, {}, { authenticated: true });
  },
};
