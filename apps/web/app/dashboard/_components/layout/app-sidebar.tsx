"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  IconBook,
  IconFolder,
  IconHome,
  IconHistory,
  IconInnerShadowTop,
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
  const pathname = usePathname();
  const workspaceId = params?.workspaceId as string | undefined;
  const projectId = params?.projectId as string | undefined;
  const isWorkspaceSelectionScreen = !workspaceId;
  
  const isExactActive = React.useCallback(
    (href: string) => pathname === href,
    [pathname],
  );
  
  const isNestedActive = React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const getWorkspaceItemActive = React.useCallback(
    (item: typeof workspaceItems[number], href: string) => {
      if (item.title === "Home") {
        return isExactActive(href);
      }
      
      if (item.title === "Projects") {
        return isExactActive(href);
      }
      
      return isNestedActive(href);
    },
    [isExactActive, isNestedActive],
  );

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
              {workspaceItems.map((item) => {
                const href = item.getUrl(workspaceId || "");
                const isActive = getWorkspaceItemActive(item, href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {workspaceId && projectId && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarMenu>
              {projectItems.map((item) => {
                const href = item.getUrl(workspaceId, projectId);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isNestedActive(href)}>
                      <Link href={href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isNestedActive(item.getUrl(workspaceId))}
                >
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
