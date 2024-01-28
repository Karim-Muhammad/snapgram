// React-Router-Dom
import { Route, Routes } from "react-router-dom";

// Auth Pages
import SignInForm from "./_auth/pages/SignInForm";
import SignUpForm from "./_auth/pages/SignUpForm";
// Pages
import {
  AllUsers,
  CreatePost,
  Explore,
  Home,
  LikedPosts,
  NotFound,
  PostDetails,
  Profile,
  SavedPosts,
  UpdatePost,
  UpdateProfile,
} from "./_root/pages";
// Layouts
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

// Styles
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <main className="flex w-full h-screen">
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
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/liked" element={<LikedPosts />} />
          <Route path="/users" element={<AllUsers />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id/*" element={<UpdateProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post" element={<UpdatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
