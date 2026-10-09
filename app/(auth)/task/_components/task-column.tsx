"use client"

import { DataTableFeatures } from "@/components/table-features";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/dateFormater";
import { Task } from "@/types/task-types";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useUpdateTaskStatusMutation } from "../_hooks/task-hooks";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Task>()

export const taskColumns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("description", {
    header: "Description",
  }),
  columnHelper.accessor("status", {
    header: "Status",

    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusConfig: Record<
        string,
        { label: string; className: string }
      > = {
        PLANNED: {
          label: "PLANNED",
          className:
            "bg-slate-100 text-slate-700 border-slate-200",
        },

        IN_PROGRESS: {
          label: "IN PROGRESS",
          className:
            "bg-blue-100 text-blue-700 border-blue-200",
        },

        COMPLETED: {
          label: "COMPLETED",
          className:
            "bg-green-100 text-green-700 border-green-200",
        },
      };

      const config = statusConfig[status] ?? {
        label: status,
        className:
          "bg-gray-50 text-gray-700 border-gray-200",
      };

      return (
        <Badge
          variant="outline"
          className={`rounded-xs px-3 py-1 text-xs font-medium ${config.className}`}
        >
          {config.label}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("priority", {
    header: "Priority",

    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;

      const priorityConfig: Record<
        string,
        { text: string; dot: string }
      > = {
        CRITICAL: {
          text: "text-red-600",
          dot: "bg-red-600",
        },
        HIGH: {
          text: "text-orange-500",
          dot: "bg-orange-500",
        },
        LOW: {
          text: "text-green-600",
          dot: "bg-green-600",
        },
      };

      const config = priorityConfig[priority] ?? {
        text: "text-gray-600",
        dot: "bg-gray-500",
      };

      return (
        <div className={`flex items-center gap-2 ${config.text}`}>
          <span
            className={`h-2 w-2 rounded-full ${config.dot}`}
          />

          <span className="font-medium">
            {priority}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor((row) => row.project?.projectName ?? "-", {
    id: "projectName",
    header: "Project",
  }),
  columnHelper.accessor("startDate", {
    header: "Start Date",
    cell: (info) => {
      const date = new Date(info.getValue())
      return formatDateTime(date.toLocaleDateString())
    }
  }),
  columnHelper.accessor("endDate", {
    header: "End Date",
    cell: (info) => {
      const date = new Date(info.getValue())
      return formatDateTime(date.toLocaleDateString())
    }
  }),
  columnHelper.display({
  id: "actions",
  header: "Status Action",
  cell: ({ row }) => {
    const task = row.original;
    const isCompleted = task.status === "COMPLETED";
    const { mutate: updateTaskMutation } = useUpdateTaskStatusMutation()

    return (
      <Button
        variant="outline"
        size="sm"
        disabled={isCompleted}
        onClick={() => {
          if(task?.id){
            updateTaskMutation(task.id)
          }
        }}
        className={
          isCompleted
            ? "text-green-600"
            : "text-blue-600 cursor-pointer"
        }
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {isCompleted ? "Completed" : "Mark Complete"}
      </Button>
    );
  },
}),
])