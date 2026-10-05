export interface Project {
  id?: string
  projectName: string
  description: string
  projectStatus: "PLANNED" | "RUNNING" | "COMPLETED"
  startDate: Date
  endDate: Date
}

export interface ProjectPagination {
  data: Project[],
  count: { PLANNED: number; RUNNING: number; COMPLETED: number } 
  pagination: {
    page: number
    limit: number
    totalPages: number
    total: number,
    hashNextPage: boolean,
    hashPreviousPage: boolean,
  }
}