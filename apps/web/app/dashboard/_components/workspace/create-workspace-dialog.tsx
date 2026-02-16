"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateWorkspaceInput,
  createWorkspaceSchema,
} from "@feedback/schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateWorkspace } from "@/hooks/api/use-workspaces";
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

interface CreateWorkspaceDialogProps {
  trigger: React.ReactNode;
}

export function CreateWorkspaceDialog({ trigger }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createWorkspaceMutation = useCreateWorkspace();

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      logo_url: undefined,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

  const onSubmit = (data: CreateWorkspaceInput) => {
    createWorkspaceMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Workspace created");
        handleOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create workspace");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize projects and collaborate with
            your team.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-workspace-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            {...form.register("name")}
            label="Workspace name"
            placeholder="Enter workspace name"
            error={form.formState.errors.name}
            disabled={createWorkspaceMutation.isPending}
          />

          <Input
            {...form.register("logo_url", {
              setValueAs: (value: string) =>
                typeof value === "string" && value.trim().length > 0
                  ? value.trim()
                  : undefined,
            })}
            label="Logo URL (optional)"
            placeholder="https://example.com/logo.png"
            type="url"
            error={form.formState.errors.logo_url}
            disabled={createWorkspaceMutation.isPending}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={createWorkspaceMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="create-workspace-form"
            disabled={createWorkspaceMutation.isPending}
          >
            {createWorkspaceMutation.isPending
              ? "Creating..."
              : "Create Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
