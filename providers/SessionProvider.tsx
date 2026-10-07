"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  logOut: () => Promise<void>;
}

export const SessionContext =
  createContext<SessionContextType | undefined>(
    undefined
  );

export const SessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { push } = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchLoggedUser = async () => {
      try {
        const response = await api.get("/api/auth/me");

        if (!ignore) {
          setUser(response?.data?.data ?? null);
        }
      } catch (error) {
        if (!ignore) {
          setUser(null);
        }

        console.log("Session check failed:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchLoggedUser();

    return () => {
      ignore = true;
    };
  }, []);

  const logOut = async () => {
    try {
      await api.post("/api/auth/logout");

      setUser(null);

      toast.success("User Logout Successfully");

      push("/");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        logOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error(
      "useSession must be used inside SessionProvider"
    );
  }

  return session;
};