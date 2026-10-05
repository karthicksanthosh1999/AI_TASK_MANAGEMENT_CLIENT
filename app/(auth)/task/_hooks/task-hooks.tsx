import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Task, TaskPagination } from "@/types/task-types";

export const useGetTask = ({ page, limit, search, status, priority }: { page: number; limit: number, search?:string, status?: string, priority?: string }) => {
    return useQuery<TaskPagination>({
        queryKey: ['Tasks', page, limit, search, status, priority],
        queryFn: () => getAllTasks(page, limit, search, status, priority),
    })
};
export const useGetAllTask = () => {
    return useQuery<Task[]>({
        queryKey: ['Tasks'],
        queryFn: () => fetchAllTasks(),
    })
};

export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Tasks'] });
            toast.success('Task created successfully', { id: 'create-task-success' });
        }
    })
};

export const useUpdateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Tasks'] });
            toast.success('Task updated successfully', { id: 'update-task-success' });
        }
    })
};

export const useDeleteTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Tasks'] });
            toast.success('Task deleted successfully', { id: 'delete-task-success' });
        }
    })
};

const getAllTasks = async (page: number, limit: number, search: string, status: string, priority: string): Promise<TaskPagination> => {
    try{
        const {data} = await api.get('/api/task', {
            params: { page, limit, search, status, priority }
        });
        return data?.data || { data: [], pagination: { page, limit, total: 0, totalPages: 0, hashNextPage: false, hashPreviousPage: false } };
    }catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

const fetchAllTasks = async (): Promise<Task[]> => {
    try{
        const response = await api.post('/api/task/allTasks');
        return response.data?.data;
    }catch(error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

const createTask = async (taskDate: Task): Promise<void> => {
    try{
        await api.post('/api/task', taskDate);
        toast.success('Task created successfully', { id: 'create-task-success' });
    }catch(error) {
        console.error('Error creating task:', error);
        toast.error('Failed to create task', { id: 'create-task-error' });
        throw error;
    }
};

const deleteTask = async (id: string): Promise<void> => {
    try{
        await api.delete(`/api/task/${id}`);
        toast.success('task deleted successfully', { id: 'delete-task-success' });
    }catch(error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task', { id: 'delete-task-error' });
        throw error;
    }
};

const updateTask = async (taskDate: Task): Promise<void> => {
    try{
        await api.put('/api/task', taskDate);
        toast.success('Task updated successfully', { id: 'update-task-success' });
    }catch(error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task', { id: 'update-task-error' });
        throw error;
    }
};
