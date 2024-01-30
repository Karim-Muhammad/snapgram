// ---------- Zod ----------
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Router DOM
import { Link, useNavigate } from "react-router-dom";

// ---------- UI Components ----------
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

// ---------- Other ----------
import { useForm } from "react-hook-form";

// Schema
import { SignInSchema } from "@/lib/validation";

// Custom Hooks
import { useUserContext } from "@/context/AuthContext";
import { useSignInMutation } from "@/lib/react-query/mutations";

// Components
import SignHeader from "../partials/SignHeader";
import FancyButton from "../FancyButton";
import { useToastContext } from "@/components/shared/radix-ui/ToasterProvider";

const SignInForm = () => {
  // States
  const navigate = useNavigate();
  const { isLoading: isAuthenticating } = useUserContext();
  const { mutateAsync: signInUser, isPending: isSignInUser } =
    useSignInMutation();

  // Context
  const { setOpen, setToast } = useToastContext();

  // React Hook Form
  const form = useForm<zod.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "John Doe",
      password: "",
    },
  });

  const onSubmit = async (data: zod.infer<typeof SignInSchema>) => {
    try {
      const session = await signInUser({
        email: data.email,
        password: data.password,
      });

      if (session?.error) {
        throw Error("This account is not exist");
      }

      setToast({
        title: "Sign In Success",
        content: "Welcome to Snapgram, let's explore more fantacy!",
      });
      setOpen(true);

      navigate("/");
      return;
    } catch (error) {
      console.log(error);
      setToast({
        title: "Authentication Error",
        content: "Account is not exists",
      });
      setOpen(true);

      return;
    }
  };

  let buttonState = "idle";
  if (isAuthenticating) buttonState = "is-authenticating";
  if (isSignInUser) buttonState = "is-signing-in";

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

        <FancyButton state={buttonState}>Sign In</FancyButton>
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
