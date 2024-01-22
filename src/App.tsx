// React-Router-Dom
import { Route, Routes } from "react-router-dom";

// Auth Pages
import SignInForm from "./_auth/pages/SignInForm";
import SignUpForm from "./_auth/pages/SignUpForm";
// Pages
import { Home } from "./_root/pages";
// Layouts
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

// Styles
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <main>
      <Toaster />

      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
