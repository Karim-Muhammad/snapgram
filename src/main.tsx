import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvder } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import App from "./App.tsx";

// Global
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvder>
          <App />
        </AuthProvder>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
