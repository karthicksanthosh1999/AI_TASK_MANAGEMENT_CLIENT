import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Project, ProjectPagination } from "@/types/project-types";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export const useGetProjects = ({ page, limit, search }: { page: number; limit: number, search:string }) => {
    return useQuery<ProjectPagination>({
        queryKey: ['projects', page, limit, search],
        queryFn: () => filterProjects(page, limit, search),
    })
};
export const useGetAllProjects = () => {
    return useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: () => getAllProjects(),
    })
};

export const useGetProjectsName = () => {
    return useQuery<{projectName:string, id: string}[]>({
        queryKey: ['projects'],
        queryFn: () => getProjectsName(),
    })
};

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully', { id: 'create-project-success' });
        }
    })
};

export const useUpdateProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated successfully', { id: 'update-project-success' });
        }
    })
};

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted successfully', { id: 'delete-project-success' });
        }
    })
};

const filterProjects = async (page: number, limit: number, search: string): Promise<ProjectPagination> => {
    try{
        const {data} = await api.get('/api/project', {
            params: { page, limit, search }
        });
        return data?.data || { data: [], pagination: { page, limit, total: 0, totalPages: 0, hashNextPage: false, hashPreviousPage: false } };
    }catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

const createProject = async (ProjectDate: Project): Promise<void> => {
    try{
        await api.post('/api/project', ProjectDate);
        toast.success('Project created successfully', { id: 'create-project-success' });
    }catch(error) {
        console.error('Error creating project:', error);
        toast.error('Failed to create project', { id: 'create-project-error' });
        throw error;
    }
};
const getAllProjects = async (): Promise<Project[]> => {
    try{
        const response = await api.post('/api/project/allProjects');
        return response.data?.data
    }catch(error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

const deleteProject = async (id: string): Promise<void> => {
    try{
        await api.delete(`/api/project/${id}`);
        toast.success('Project deleted successfully', { id: 'delete-project-success' });
    }catch(error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project', { id: 'delete-project-error' });
        throw error;
    }
};

const updateProject = async (ProjectDate: Project): Promise<void> => {
    try{
        await api.put('/api/project', ProjectDate);
        toast.success('Project updated successfully', { id: 'update-project-success' });
    }catch(error) {
        console.error('Error updating project:', error);
        toast.error('Failed to update project', { id: 'update-project-error' });
        throw error;
    }
};

const getProjectsName = async (): Promise<{projectName: string, id: string}[]> => {
    try{
        const response = await api.get('/api/project/projectsName');
        return response.data.data;
    }catch(error) {
        console.error('Error updating project:', error);
        toast.error('Failed to fetch project', { id: 'fetch-project-error' });
        throw error;
    }
};
