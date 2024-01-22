// ---------- Zod ----------
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Router DOM
import { Link } from "react-router-dom";

// ---------- UI Components ----------
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------- Other ----------
import { useForm } from "react-hook-form";

// Schema
import { SignInSchema } from "@/lib/validation";
import SignHeader from "../partials/SignHeader";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
  // States
  const { isLoading } = useUserContext();

  // React Hook Form
  const form = useForm<zod.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "John Doe",
      password: "",
    },
  });

  const onSubmit = (data: zod.infer<typeof SignInSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <SignHeader
        title="Join to us"
        description="Let's Explore more fantacy!"
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex flex-col gap-5 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary">
          {isLoading ? <Loader /> : "Sign In"}
        </Button>
      </form>

      <div className="flex flex-col items-center pt-5">
        <p className="text-light-3 small-medium">
          Don't have an account?
          <Link className="text-primary-500 small-medium ml-1" to="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignInForm;
