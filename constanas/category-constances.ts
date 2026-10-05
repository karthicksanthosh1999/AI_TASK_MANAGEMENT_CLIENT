import { IPagination } from "./pagination-constances";

export type ICategorie = {
  id?: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategory {
  id?: number;
  name: string;
  description: string;
}

export interface ICategoryQuery {
  search?: string;
  page: number;
  limit: number;
}
export interface ICategoriesResponse {
  data: ICategorie[]
}
