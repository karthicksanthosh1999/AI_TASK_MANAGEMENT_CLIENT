"use client"

import {
  flexRender,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button";
import { features, type DataTableFeatures } from "./table-features";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  pagination: Pagination
  loading?: boolean
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onConfirmDelete?: (id: string) => void
  onEdit?: (item: TData | null) => void
  height?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  loading = false,
  onPageChange,
  onLimitChange,
  onConfirmDelete,
  onEdit,
  height
}: DataTableProps<TData>) {

  const table = useTable({
    features,
    data,
    columns,
  })
  const {
    page,
    limit,
    total,
    totalPages,
  } = pagination;

  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleDeleteModel = () => {
    setDeleteModelOpen((prev) => !prev);
    if(selectedItemId) {
      onConfirmDelete?.(selectedItemId);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= TABLE ================= */}
      <div className={`overflow-hidden rounded-md border ${height ? height : ""}`}>
        <Table className="bg-card">
          {/* Header */}
          <TableHeader className="bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}

                <TableHead>Actions</TableHead>

              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {/* Loading */}
            {loading ? (
              <TableRow className="h-fit">
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    <span className="text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (

              /* Data */
              data.map((_, index) => {
                const row = table.getRowModel().rows[index]

                return (
                  <TableRow key={row.id} className="hover:bg-accent/50 transition-colors h-5">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="h-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {/* Actions */}
                    <TableCell className="h-5">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer rounded-xs"
                          onClick={() => onEdit?.(row.original)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer rounded-xs"
                          onClick={() => {
                            setDeleteModelOpen(true);
                            setSelectedItemId(row.original?.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              /* No Data */
              <TableRow className="h-5">
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-32 text-center"
                >
                  <div className="text-muted-foreground">
                    No data found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ================= PAGINATION ================= */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between border px-4 rounded-sm">
          {/* Total */}
          <div className="text-sm text-muted-foreground">
            Total {total} records
          </div>
          <div className="flex items-center gap-x-2">
            {/* Page size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>

              <select
                value={limit}
                onChange={(event) =>
                  onLimitChange(Number(event.target.value))
                }
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            {/* Page */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className={'cursor-pointer'}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </Button>

              <span className="text-sm px-2">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className={'cursor-pointer'}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </Button>

            </div>
        </div>

        </div>
      )}
      {
        deleteModelOpen && (
              <Dialog open={deleteModelOpen} onOpenChange={setDeleteModelOpen}>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Item</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this item?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="p-2">
                  <Button variant="outline" onClick={() => setDeleteModelOpen(false)} className={"rounded-xs cursor-pointer"}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleDeleteModel} className={'text-white cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 rounded-xs'} >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        )
      }
    </div>
  )
}