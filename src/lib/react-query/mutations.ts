import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewUser,
  createPost,
  getRecentPosts,
  likePost,
  signInUser,
  signOutUser,
  updatePost,
} from "../appwrite/apis";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

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

export const useSignOutAccountMutation = () => {
  return useMutation({
    mutationFn: signOutUser,
  });
};

// ====================== POSTS ======================

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
  });
};

export const useGetPostsMutation = () => {
  return useMutation({
    mutationFn: getRecentPosts,
  });
};

// ====================== LIKES ======================

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string, likesArray: string[]) =>
      likePost(postId, likesArray),
    onSuccess: (data: Models.Document) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.$id],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
    },
  });
};

// ====================== Saves ======================
