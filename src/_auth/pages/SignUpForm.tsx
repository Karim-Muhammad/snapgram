// Zod
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Router DOM
import { Link, useNavigate } from "react-router-dom";

// React
import { useEffect } from "react";

// Shadcn UI Components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Shadcn Other
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";

// React Hook form
import { useForm } from "react-hook-form";

// Custom Hooks
import { useUserContext } from "@/context/AuthContext";
import { useToastContext } from "@/components/shared/radix-ui/ToasterProvider";
import {
  useCreateUserAccountMutation,
  useSignInMutation,
} from "@/lib/react-query/mutations";

// APIs
// import { createNewUser, signInUser } from "@/lib/appwrite/apis";

// Schema
import { SignUpSchema } from "@/lib/validation";

// Components
import SignInHeader from "../partials/SignHeader";
// import Loader from "@/components/shared/Loader";
import FancyButton from "../FancyButton";

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

const SignUpForm = () => {
  // ========================= Custom Hooks
  // const { toast } = useToast();

  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isAuthenticating } = useUserContext();
  const { setOpen, setToast } = useToastContext();

  // ========================= React Query
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccountMutation();
  const { mutateAsync: signInUserAccount, isPending: isSignInUser } =
    useSignInMutation();

  // ========================= useForm
  const form = useForm<zod.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "Karim",
      username: "KEMO",
      email: "kimo@gmail.com",
      password: "asdasdasdasd",
    },
  });

  // ========================= onSubmit
  const onSubmit = async (data: zod.infer<typeof SignUpSchema>) => {
    try {
      const account = await createUserAccount(data);
      if (account?.error) {
        setToast({
          // old `return toast`
          variant: "destructive",
          title: "Failed to create an account",
          content: "Something went wrong",
        });
        console.log("account?.error", account?.error);
        setOpen(true);

        return;
      }

      const session = await signInUserAccount({
        email: data.email,
        password: data.password,
      });

      if (!session) {
        setToast({
          variant: "destructive",
          title: "Failed to Login with an account",
          content: "Something went wrong",
        });
        setOpen(true);

        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();
      if (!isLoggedIn) throw Error;

      form.reset();
      setToast({
        variant: "destructive",
        title: "Account created successfully",
        content: "Welcome to Shadcn",
      });
      setOpen(true);

      navigate("/");
      return;
    } catch (error) {
      setToast({
        variant: "destructive",
        title: "Failed to create an account",
        content:
          error instanceof Error ? error.message : "Something went wrong",
      });
      setOpen(true);

      navigate("/sign-in");
      return;
    }
  };

  // ========================= useEffect

  useEffect(() => {
    console.log("SignUpForm");
  }, []);

  // ========================= Manipulation JSX

  let buttonStatus = "idle";
  if (isSignInUser) buttonStatus = "is-signing-in";
  if (isCreatingUser) buttonStatus = "is-creating-user";
  if (isAuthenticating) buttonStatus = "is-authenticating";

  return (
    <Form {...form}>
      <SignInHeader
        title="Create an account"
        description="to join to us, enter your details"
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex flex-col w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  type="text"
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  type="text"
                  placeholder="Mor3B"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  type="email"
                  placeholder="example@gmail.com"
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
                <Input className="shad-input" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FancyButton state={buttonStatus}>Create an account</FancyButton>
      </form>

      <div>
        <p className="text-light-3 small-medium">
          Already have an account?
          <Link className="text-primary-500 ml-1" to="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;
