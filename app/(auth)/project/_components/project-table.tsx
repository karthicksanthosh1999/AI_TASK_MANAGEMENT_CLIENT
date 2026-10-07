'use client'

import { DataTable } from "@/components/data-table"
import { projectColumns } from "./project-column"
import { useDeleteProjectMutation, useGetProjects } from "../_hooks/project-hooks"
import { useCallback, useState } from "react"
import ProjectHeader from "./project-header";
import { Project } from "next/dist/build/swc/types";
import { useDebounce } from "@/hooks/use-debounce";

const ProjectTable = () => {
  const [search, setSearch] = useState("")

  const debounceSearch = useDebounce(search, 500)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetProjects({
    page: pagination.page,
    limit: pagination.limit,
    search: debounceSearch ?? "",
  });
  
  const { mutate: deleteProjectMutation } = useDeleteProjectMutation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  },[])

  const handleLimitChange = useCallback((limit: number) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit,
    }));
  }, []);

  const handleEdit = useCallback((project: Project) => {
    setIsOpen(true);
    setSelectedProject(project);
  },[])

  return (
    <div className="space-y-2">
      <ProjectHeader 
          title="Projects" 
          buttonTitle="Add Project" 
          selectedProject={selectedProject} 
          setSelectedProject={setSelectedProject} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          count={data?.count ?? { PLANNED: 0, RUNNING: 0, COMPLETED: 0 }}
          search={search} 
          setSearch={setSearch}
      />

      <DataTable
        columns={projectColumns}
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

export default ProjectTable