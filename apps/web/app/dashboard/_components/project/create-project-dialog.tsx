"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectInput,
  type Project,
} from "@feedback/schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateProject } from "@/hooks/api/use-projects";
import { Button } from "@feedback/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@feedback/ui/components/dialog";
import { Input } from "@feedback/ui/components/input";

interface CreateProjectDialogProps {
  workspaceId: string;
  trigger: React.ReactNode;
  onCreated?: (project: Project) => void;
}

export function CreateProjectDialog({
  workspaceId,
  trigger,
  onCreated,
}: CreateProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createProjectMutation = useCreateProject(workspaceId);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      workspace_id: workspaceId,
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    form.setValue("workspace_id", workspaceId);
  }, [form, workspaceId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset({
        workspace_id: workspaceId,
        name: "",
        description: "",
      });
    }
  };

  const onSubmit = (data: CreateProjectInput) => {
    createProjectMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Project created");
        onCreated?.(response.data);
        handleOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create project");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a project in this workspace to collect and manage feedback.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-project-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            {...form.register("name")}
            label="Project name"
            placeholder="Enter project name"
            error={form.formState.errors.name}
            disabled={createProjectMutation.isPending}
          />

          <Input
            {...form.register("description")}
            label="Description (optional)"
            placeholder="Describe this project"
            error={form.formState.errors.description}
            disabled={createProjectMutation.isPending}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={createProjectMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="create-project-form"
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
