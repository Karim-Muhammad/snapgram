import { useState, useContext, createContext, ReactNode } from "react";
import * as Toast from "@radix-ui/react-toast";
import "./Toaster.css";

type IToastType = {
  variant?: "success" | "warning" | "destructive";
  title: string;
  content: string;
};

type IToastContextType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToast: React.Dispatch<React.SetStateAction<IToastType>>;
};

const ToastContext = createContext<IToastContextType>({
  setOpen: () => {},
  setToast: () => {},
});

const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<IToastType>({
    variant: "destructive",
    title: "",
    content: "",
  });

  const value = {
    setOpen,
    setToast,
  };

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right">
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle">{toast.title}</Toast.Title>
          <Toast.Description className="ToastDescription">
            {toast.content}
          </Toast.Description>
          <Toast.Close />
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />

        {children}
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export default ToasterProvider;

export const useToastContext = () => useContext(ToastContext);
