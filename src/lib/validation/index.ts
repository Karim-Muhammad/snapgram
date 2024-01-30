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

export const PostValidationSchema = zod.object({
  caption: zod
    .string()
    .min(5, "caption must be at least 5 chars")
    .max(2200, "caption must be less than 2200 chars"),
  file: zod.custom<File[]>(),
  // file: zod.array(zod.string().url("Please upload a valid image")).optional(),
  location: zod
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must be less than 100 characters"),

  // tags: zod.array(zod.string().min(3, "Tag must be at least 3 characters")),
  tags: zod.string(),
});
