import * as zod from "zod";

export const SignInSchema = zod.object({
  email: zod.string().email("Please enter a valid email"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

export const SignUpSchema = zod.object({
  name: zod.string().min(3, { message: "Name must be at least 3 characters" }),
  username: zod
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: zod.string().email(),
  password: zod.string().min(8),
});
