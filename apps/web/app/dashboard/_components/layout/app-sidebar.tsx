"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconBook,
  IconFolder,
  IconHome,
  IconHistory,
  IconInnerShadowTop,
  IconMail,
  IconMap2,
  IconMessage,
  IconSettings,
  IconTag,
  IconUsers,
} from "@tabler/icons-react";

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@feedback/ui/components/sidebar";

const workspaceItems = [
  {
    title: "Home",
    icon: IconHome,
    getUrl: (workspaceId: string) => {
      void workspaceId;
      return "/dashboard";
    },
  },
  {
    title: "Projects",
    icon: IconFolder,
    getUrl: (workspaceId: string) => `/dashboard/${workspaceId}`,
  },
  {
    title: "Members",
    icon: IconUsers,
    getUrl: (workspaceId: string) => `/dashboard/${workspaceId}/members`,
  },
  {
    title: "Settings",
    icon: IconSettings,
    getUrl: (workspaceId: string) => {
      void workspaceId;
      return "#";
    },
  },
];

const projectItems = [
  {
    title: "Feedbacks",
    icon: IconMessage,
    getUrl: (workspaceId: string, projectId: string) =>
      `/dashboard/${workspaceId}/projects/${projectId}/feedbacks`,
  },
  {
    title: "Labels",
    icon: IconTag,
    getUrl: (workspaceId: string, projectId: string) => {
      void workspaceId;
      void projectId;
      return "#";
    },
  },
  {
    title: "Roadmaps",
    icon: IconMap2,
    getUrl: (workspaceId: string, projectId: string) => {
      void workspaceId;
      void projectId;
      return "#";
    },
  },
  {
    title: "Settings",
    icon: IconSettings,
    getUrl: (workspaceId: string, projectId: string) => {
      void workspaceId;
      void projectId;
      return "#";
    },
  },
];

const otherItems = [
  {
    title: "Invites",
    icon: IconMail,
    getUrl: (workspaceId?: string) =>
      workspaceId ? `/dashboard/${workspaceId}/members` : "/dashboard",
  },
  {
    title: "Account Settings",
    icon: IconSettings,
    getUrl: (workspaceId?: string) => {
      void workspaceId;
      return "#";
    },
  },
  {
    title: "Docs",
    icon: IconBook,
    getUrl: (workspaceId?: string) => {
      void workspaceId;
      return "#";
    },
  },
  {
    title: "Changelog",
    icon: IconHistory,
    getUrl: (workspaceId?: string) => {
      void workspaceId;
      return "#";
    },
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;
  const projectId = params?.projectId as string | undefined;
  const isWorkspaceSelectionScreen = !workspaceId;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={workspaceId ? `/dashboard/${workspaceId}` : "#"}>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!isWorkspaceSelectionScreen && (
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.getUrl(workspaceId || "")}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {workspaceId && projectId && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={
                        workspaceId && projectId
                          ? item.getUrl(workspaceId, projectId)
                          : "#"
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.getUrl(workspaceId)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
