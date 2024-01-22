import { useMutation } from "@tanstack/react-query";
import { createNewUser, signInUser } from "../appwrite/apis";
import { INewUser } from "@/types";

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (newUser: INewUser) => createNewUser(newUser),
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInUser(user),
  });
};
