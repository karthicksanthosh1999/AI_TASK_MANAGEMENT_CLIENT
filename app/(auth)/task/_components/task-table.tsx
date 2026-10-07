"use client";

import { DataTable } from "@/components/data-table";
import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import TaskHeader from "./task-header";
import { taskColumns } from "./task-column";
import { Task } from "@/types/task-types";
import {
  useDeleteTaskMutation,
  useGetTask,
} from "../_hooks/task-hooks";

const TaskTable = () => {
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 500);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    status: "",
    priority: "",
  });

  const { data, isLoading } = useGetTask({
    page: pagination.page,
    limit: pagination.limit,
    search: debounceSearch ?? "",
    status: pagination.status,
    priority: pagination.priority,
  });

  const { mutate: deleteTaskMutation } =useDeleteTaskMutation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit,
    }));
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsOpen(true);
  }, []);

  return (
    <div className="space-y-2">
      <TaskHeader
        title="Tasks"
        buttonTitle="Add Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        count={
          data?.count ?? {
            PLANNED: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
          }
        }
        search={search}
        setSearch={setSearch}
      />

      <DataTable
        columns={taskColumns}
        data={data?.data ?? []}
        loading={isLoading}
        pagination={{
          page: data?.pagination?.page ?? pagination.page,
          limit:data?.pagination?.limit ?? pagination.limit,
          total: data?.pagination?.total ?? 0,
          totalPages:data?.pagination?.totalPages ?? 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onConfirmDelete={deleteTaskMutation}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default TaskTable;