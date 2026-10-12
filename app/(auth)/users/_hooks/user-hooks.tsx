import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { User } from "@/types/user-types";

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Project updated successfully', { id: 'update-project-success' });
        }
    })
};

const updateUser = async (user: User): Promise<void> => {
    try{
        await api.put('/api/user', user);
        toast.success('User updated successfully', { id: 'update-user-success' });
    }catch(error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user', { id: 'update-user-error' });
        throw error;
    }
};