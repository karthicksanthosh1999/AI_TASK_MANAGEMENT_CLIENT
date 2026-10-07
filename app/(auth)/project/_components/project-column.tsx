"use client"

import { DataTableFeatures } from "@/components/table-features";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/dateFormater";
import { Project } from "@/types/project-types";
import { createColumnHelper } from "@tanstack/react-table";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Project>()

export const projectColumns = columnHelper.columns([
  columnHelper.accessor("projectName", {
    header: "Project Name",
  }),
  columnHelper.accessor("description", {
    header: "Description",
  }),
columnHelper.accessor("projectStatus", {
  header: "Status",

  cell: ({ row }) => {
    const status = row.getValue("projectStatus") as string;

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
])