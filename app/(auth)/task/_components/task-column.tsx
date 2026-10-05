"use client"

import { DataTableFeatures } from "@/components/table-features";
import { formatDateTime } from "@/lib/dateFormater";
import { Task } from "@/types/task-types";
import { createColumnHelper } from "@tanstack/react-table";

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
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
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
])