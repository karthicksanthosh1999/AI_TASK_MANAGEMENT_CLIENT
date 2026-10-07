import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useSendEmailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['email'] });
            toast.success('Email send successfully', { id: 'email-send-success' });
        }
    })
};

export const useSendOtpMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendOtp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['otp'] });
            toast.success('OTP verify successfully', { id: 'otp-send-success' });
        }
    })
};


export const useResetPasswordMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resetPasswordOtp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['password'] });
            toast.success('Password reset successfully', { id: 'password-send-success' });
        }
    })
};

interface SendEmailPayload {
  email: string;
}


const sendEmail = async ({ email } : SendEmailPayload): Promise<void> => {
    try{
        await api.post('/api/auth/forget-password', {email});
        toast.success('Email send successfully', { id: 'email-send-success' });
    }catch(error) {
        console.error('Error creating project:', error);
        toast.error('Failed to send email', { id: 'email-send-error' });
        throw error;
    }
};

interface SendOtpPayload {
  email: string;
  otp: string;
}

const sendOtp = async ({otp, email} : SendOtpPayload): Promise<void> => {
    try{
        await api.post('/api/auth/verified-otp', {otp, email});
        toast.success('OTP send successfully', { id: 'otp-send-success' });
    }catch(error) {
        console.error('Error creating project:', error);
        toast.error('Failed to send otp', { id: 'otp-send-error' });
        throw error;
    }
};

interface ResetPasswordPayload {
  email: string;
  password: string;
}

const resetPasswordOtp = async ({password, email} : ResetPasswordPayload): Promise<void> => {
    try{
        await api.post('/api/auth/update-password', {password, email});
        toast.success('Password send successfully', { id: 'password-send-success' });
    }catch(error) {
        console.error('Error creating project:', error);
        toast.error('Failed to send Password', { id: 'password-send-error' });
        throw error;
    }
};