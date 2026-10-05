'use client'

import { DataTable } from "@/components/data-table";
import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Task } from "@/types/task-types";
import { useDeleteTaskMutation, useGetTask } from "../../task/_hooks/task-hooks";
import TaskHeader from "../../task/_components/task-header";
import { taskColumns } from "../../task/_components/task-column";

const RecentTasks = () => {
  const [search, setSearch] = useState("")

   const debounceSearch = useDebounce(search, 500)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    status: "IN_PROGRESS", 
    priority: "CRITICAL"
  })
  const { data, isLoading } = useGetTask({
    page: pagination.page,
    limit: pagination.limit,
    search: debounceSearch!,
    status: pagination.status,
    priority: pagination.priority
  })
  const { mutate: deleteProjectMutation } = useDeleteTaskMutation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  },[])

  const handleLimitChange = useCallback((limit: number) => {
    setPagination({ page: 1, limit, priority, status})
  },[])

  const handleEdit = useCallback((task: Task) => {
    console.log('Editing task:', task);
    setIsOpen(true);
    if(task){
      setSelectedTask(task);
    }
  },[])

  return (
    <div className="space-y-2">
      <TaskHeader
          title="Critical Tasks" 
          selectedTask={selectedTask} 
          setSelectedTask={setSelectedTask} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          search={search} 
          setSearch={setSearch}
      />
      <DataTable
        height="h-[300px]"
        columns={taskColumns}
        data={data?.data ?? []}
        loading={isLoading}
        pagination={{
          page: data?.pagination?.page ?? pagination.page,
          limit: data?.pagination?.limit ?? pagination.limit,
          total: data?.pagination?.total ?? 0,
          totalPages: data?.pagination?.totalPages ?? 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onConfirmDelete={deleteProjectMutation}
        onEdit={handleEdit}
      />
    </div>
  )
}

export default RecentTasks;