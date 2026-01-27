"use client";

import * as React from "react";
import {
  IconArrowsSort,
  IconFilter,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import type { Feedback } from "@feedback/schema";
import { Input } from "@feedback/ui/components/input";
import { Button } from "@feedback/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@feedback/ui/components/dropdown-menu";
import { Badge } from "@feedback/ui/components/badge";
import { FeedbackTable } from "./feedback-table";

interface FeedbackListProps {
  data: Feedback[];
}

const statusOptions = [
  { value: "open", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Done" },
  { value: "closed", label: "Closed" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "recently-updated", label: "Recently updated" },
  { value: "most-upvoted", label: "Most upvoted" },
];

export function FeedbackList({ data }: FeedbackListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState("newest");

  const allLabels = React.useMemo(() => {
    const labelMap = new Map<
      string,
      { id: string; name: string; color: string | null }
    >();
    data.forEach((feedback) => {
      feedback.labels?.forEach((label) => {
        if (!labelMap.has(label.id)) {
          labelMap.set(label.id, {
            id: label.id,
            name: label.name,
            color: label.color,
          });
        }
      });
    });
    return Array.from(labelMap.values());
  }, [data]);

  const filteredData = React.useMemo(() => {
    const filtered = data.filter((feedback) => {
      const matchesSearch =
        !searchQuery ||
        feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        feedback.customer_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(feedback.status);

      const matchesLabel =
        selectedLabels.length === 0 ||
        feedback.labels?.some((label) => selectedLabels.includes(label.id));

      return matchesSearch && matchesStatus && matchesLabel;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "recently-updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "most-upvoted":
          // TODO: Implement when upvote count is added to schema
          return 0;
        default:
          return 0;
      }
    });

    return sorted;
  }, [data, searchQuery, selectedStatuses, selectedLabels, sortBy]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((l) => l !== labelId)
        : [...prev, labelId],
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedLabels([]);
  };

  const hasActiveFilters =
    selectedStatuses.length > 0 || selectedLabels.length > 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground text-sm">
            Manage and respond to customer feedback
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-sm">
              <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-dashed"
                >
                  <IconFilter className="size-4" />
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 size-5 rounded-full p-0 text-xs font-medium"
                    >
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.value}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={() => toggleStatus(status.value)}
                  >
                    {status.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Labels Filter */}
            {allLabels.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-dashed"
                  >
                    <IconFilter className="size-4" />
                    Labels
                    {selectedLabels.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 size-5 rounded-full p-0 text-xs font-medium"
                      >
                        {selectedLabels.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel>Filter by label</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allLabels.map((label) => (
                    <DropdownMenuCheckboxItem
                      key={label.id}
                      checked={selectedLabels.includes(label.id)}
                      onCheckedChange={() => toggleLabel(label.id)}
                    >
                      {label.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <IconArrowsSort className="size-4" />
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                Clear
                <IconX className="size-4" />
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedStatuses.map((status) => {
                const statusOption = statusOptions.find(
                  (s) => s.value === status,
                );
                return (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="gap-1.5 rounded-md pr-1"
                  >
                    {statusOption?.label}
                    <button
                      onClick={() => toggleStatus(status)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                );
              })}
              {selectedLabels.map((labelId) => {
                const label = allLabels.find((l) => l.id === labelId);
                if (!label) return null;
                return (
                  <Badge
                    key={labelId}
                    variant="secondary"
                    className="gap-1.5 rounded-md pr-1"
                  >
                    {label.name}
                    <button
                      onClick={() => toggleLabel(labelId)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Table View */}
      <div className="w-full">
        {filteredData.length > 0 ? (
          <FeedbackTable data={filteredData} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 mx-4 lg:mx-6">
            <p className="text-muted-foreground text-sm">No feedback found</p>
          </div>
        )}
      </div>
    </div>
  );
}
