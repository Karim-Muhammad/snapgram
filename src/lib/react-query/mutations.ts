import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewUser,
  createPost,
  deletePost,
  likePost,
  savePost,
  signInUser,
  signOutUser,
  unsavePost,
  updatePost,
} from "../appwrite/APIs";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

// ====================== USERS ======================

// ---------------- Create User Mutation
export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (newUser: INewUser) => createNewUser(newUser),
  });
};

// ---------------- Sign In Mutation
export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInUser(user),
  });
};

// ---------------- Sign Out Mutation
export const useSignOutAccountMutation = () => {
  return useMutation({
    mutationFn: signOutUser,
  });
};

// ====================== POSTS ======================

// ---------------- Create Post Mutation
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

// ---------------- Update Post Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post?.$id],
      });
    },
  });
};

// ---------------- Delete Post Mutation
export const useDeletePostMutation = (postID: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePost(postID),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
    },
  });
};

// ====================== LIKES ======================

// ---------------- Like Post Mutation
export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray) as Promise<Models.Document>,

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

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
      });
    },
  });
};

// ====================== Saves ======================

// ---------------- Save Post Mutation
export const useSavePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      // I don't know why he doesn't invalidate this query

      // queryClient.invalidateQueries({
      //   queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.$id],
      // });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
    },
  });
};

// ---------------- Unsave Post Mutation
export const useUnsavePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unsavePost(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
    },
  });
};

// ====================== Comments [not yet] ======================

// ---------------- Create Comment Mutation
// export const useCreateCommentMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ postId, comment }: { postId: string; comment: string }) =>
//       commentOnPost(postId, comment) as Promise<Models.Document>,

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });

//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });

//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_POSTS],
//       });
//     },
//   });
// };

// ====================== User ======================
