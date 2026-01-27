"use client";

import { IconArrowUp, IconSparkles } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@feedback/ui/components/avatar";
import type { Feedback } from "@feedback/schema";

interface FeedbackCardProps {
  feedback: Feedback;
}

const statusConfig = {
  open: {
    color: "#3b82f6",
    label: "New",
  },
  "in-progress": {
    color: "#f59e0b",
    label: "In Progress",
  },
  completed: {
    color: "#10b981",
    label: "Done",
  },
  closed: {
    color: "#94a3b8",
    label: "Closed",
  },
} as const;

const defaultStatus = statusConfig.open;

function getInitials(name: string | null): string {
  if (!name || name === "Anonymous") return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusConfig(status: string): { color: string; label: string } {
  const config = statusConfig[status as keyof typeof statusConfig];
  return config || defaultStatus;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const status = getStatusConfig(feedback.status);
  const hasHighPriority = feedback.labels?.some((l) =>
    l.name.toLowerCase().includes("priority"),
  );

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-sidebar shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:shadow-black/5 hover:ring-black/10 dark:ring-white/10 dark:hover:ring-white/20">
      <div className="flex gap-5 p-6">
        {/* Upvote section with modern styling */}
        <div className="flex shrink-0 flex-col items-center">
          <button
            onClick={(e) => e.stopPropagation()}
            className="group/vote relative flex size-14 flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-black/5 bg-linear-to-br from-background to-muted/30 shadow-sm transition-all hover:scale-105 hover:border-primary/20 hover:from-primary/5 hover:to-primary/10 hover:shadow-md active:scale-95 dark:border-white/10 dark:hover:border-primary/30"
          >
            <IconArrowUp
              className="size-5 transition-all group-hover/vote:text-primary"
              strokeWidth={2}
            />
            <span className="text-sm font-bold">12</span>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header with title and status */}
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                {hasHighPriority && (
                  <div className="flex size-5 items-center justify-center rounded bg-linear-to-br from-orange-500 to-pink-600 shadow-sm">
                    <IconSparkles
                      className="size-3 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight transition-colors hover:text-primary mb-0">
                  {feedback.title}
                </h3>
              </div>
              {feedback.description && (
                <p className="text-muted-foreground line-clamp-2 text-[15px] leading-relaxed">
                  {feedback.description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* Status pill */}
              <div
                className="flex items-center gap-1 rounded-md px-2 py-0.5"
                style={{
                  borderWidth: "1px",
                  borderColor: `${status.color}20`,
                  backgroundColor: `${status.color}08`,
                }}
              >
                <div
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-xs font-medium">{status.label}</span>
              </div>
            </div>
          </div>

          {/* Labels section */}
          {feedback.labels && feedback.labels.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {feedback.labels.slice(0, 4).map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center rounded-md border border-black/5 bg-background/50 px-2.5 py-1 text-xs font-medium backdrop-blur-sm dark:border-white/10"
                >
                  {label.name}
                </span>
              ))}
              {feedback.labels.length > 4 && (
                <span className="inline-flex items-center rounded-md border border-black/5 bg-background/50 px-2.5 py-1 text-xs font-medium backdrop-blur-sm dark:border-white/10">
                  +{feedback.labels.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7 ring-2 ring-background ring-offset-1 ring-offset-muted/20">
              <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-xs font-bold text-primary">
                {getInitials(feedback.customer_name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm font-medium">
              {feedback.customer_name || "Anonymous"}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-muted-foreground/60 text-sm">
              {getRelativeTime(feedback.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
