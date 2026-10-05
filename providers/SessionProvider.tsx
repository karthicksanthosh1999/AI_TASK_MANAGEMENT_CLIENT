"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface User {
    id: string;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
    createdAt: string;
    image?: string;
}

interface SessionContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    refetchUser: ()=> Promise<void>;
    logOut: () => Promise<void>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({children} : {children : ReactNode}) => {

    const { push } = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLoggedUser = async() => {
        try {
            setLoading(true)
            const response = await api.get("/api/auth/me");
            setUser(response?.data?.data)
        } catch (error) {
            setUser(null)
            push("/")
            toast.success("Login Session Expired, Please Login Again")
            console.log(error)
        }finally{
            setLoading(false)
        }
    };

    const logOut = async() => {
        try {
            await api.post("/api/auth/logout");
            setUser(null)
            push("/")
            toast.success("User Logout Successfully")
        } catch (error) {
            setUser(null)
            console.log(error)
        }
    };

    useEffect(()=>{
        fetchLoggedUser();
    },[])

    return (
        <SessionContext.Provider  value={{ user, isAuthenticated: !!user, loading, refetchUser: fetchLoggedUser, logOut: logOut }}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    const session = useContext(SessionContext);
    if(!session) {
        throw new Error("useSession must be used inside SessionProvider")
    };
    return session;
}