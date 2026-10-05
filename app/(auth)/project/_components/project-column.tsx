"use client"

import { DataTableFeatures } from "@/components/table-features";
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