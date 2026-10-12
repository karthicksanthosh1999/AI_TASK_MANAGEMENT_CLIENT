
export interface User {
  id?: string
  name: string
  email: string
  password?: string
  joinedDate?: Date | string
  role: "USER" | "ADMIN"
}

export interface UserPagination {
  data: User[],
  pagination: {
    page: number
    limit: number
    totalPages: number
    total: number,
    hashNextPage: boolean,
    hashPreviousPage: boolean,
  }
}