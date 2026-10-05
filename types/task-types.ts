import { User } from "@/providers/SessionProvider";
import { Project } from "./project-types";

export interface Task {
  id?: string
  title: string
  description: string
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
  priority: "LOW" | "HIGH" | "CRITICAL"
  projectId: string
  userId: string
  startDate: Date
  endDate: Date
  project: Project | null,
  user: User | null
}

export interface TaskPagination {
  data: Task[],
  count: { PLANNED: number; IN_PROGRESS: number; COMPLETED: number } 
  pagination: {
    page: number
    limit: number
    totalPages: number
    total: number,
    hashNextPage: boolean,
    hashPreviousPage: boolean,
  }
}