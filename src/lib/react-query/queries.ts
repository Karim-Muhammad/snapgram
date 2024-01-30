import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import {
  getCurrentUser,
  getRecentPosts,
  getPostById,
  getInfinitePosts,
  getSearchResults,
  getSavedPosts,
} from "../appwrite/APIs";
import { getUsers } from "../appwrite/APIs/features/userApis";
import { getPostByTag } from "../appwrite/APIs/features/postsApis";

// ====================== USERS ======================
// ---------------- Get Current User Query
export const useGetUserQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

// ---------------- Get Users Query
export const useGetUsersQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getUsers,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: null,
    enabled: true, // only run if user pressed button "load more"
  });
};

// Get Saved Posts
export const useSavedPostsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS], // [done] actually this is not have query keys! i think
    queryFn: getSavedPosts,
  });
};

// ====================== POSTS ======================
// ---------------- Get Recent Posts Query
export const useGetRecentPostsQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },

    initialPageParam: null,
  });
};

export const useGetPostByIdQuery = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, // only run if postId is defined (doesn't understand it)
  });
};

export const useGetPostByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostByTag(tag),
    enabled: !!tag, // only run if tag is defined (doesn't understand it)
  });
};

// ---------------- Get Recent Posts Mutation
export const useGetInfinitePostsQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },

    initialPageParam: null,
  });
};

export function useGetSearchResultsQuery(querySearch: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => getSearchResults(querySearch),
    enabled: !!querySearch,
    // Why enabled? https://react-query.tanstack.com/guides/query-keys#query-keys
  });
}

/**
 * Errors in only types
 */
