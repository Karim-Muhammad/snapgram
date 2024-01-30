import ToasterProvider from "@/components/shared/radix-ui/ToasterProvider";
import { getCurrentUser } from "@/lib/appwrite/APIs";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  bio: "",
  imageUrl: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean, // need revise
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

// ===================== Provider
export function AuthProvder({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // ===================== State
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ===================== Middleware
  const checkAuthUser = async () => {
    setIsLoading(true);

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw Error;

      setUser({
        id: currentUser.$id,
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio,
        imageUrl: currentUser.imageUrl,
      });

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null ||
      localStorage.getItem("cookieFallback") === undefined
    ) {
      console.log("cookieFallback is empty");
      navigate("/sign-in");
      // when navigate , this useEffect will not be called again , because of [] deps
      return;
    }

    checkAuthUser();
  }, []);
  // without [] deps, it will cause infinite loop and calling naviagte("/sign-in") infinitely

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
      }}
    >
      <ToasterProvider>{children}</ToasterProvider>
    </AuthContext.Provider>
  );
}

export const useUserContext = () => useContext(AuthContext);
