import AuthAPIs from "./features/authApis";
import PostApis from "./features/postsApis";
import PostAPIs from "./features/postsApis";

// AUTH APIS
export const getCurrentUser = AuthAPIs.getCurrentUser;
export const getAccount = AuthAPIs.getAccount;
export const createNewUser = AuthAPIs.createNewUser;
export const saveUserInDB = AuthAPIs.saveUserInDB;
export const signInUser = AuthAPIs.signInUser;
export const signOutUser = AuthAPIs.signOutUser;

// POSTS APIS
export const getRecentPosts = PostAPIs.getRecentPosts;
export const getInfinitePosts = PostApis.getInfinitePosts;
export const getPostById = PostApis.getPostById;
export const getSearchResults = PostApis.getSearchResults;
export const getSavedPosts = PostAPIs.getSavedPosts;

export const createPost = PostAPIs.createPost;
export const updatePost = PostAPIs.updatePost;
export const deletePost = PostAPIs.deletePost;
export const deleteFile = PostAPIs.deleteFile;
export const savePost = PostAPIs.savePost;
export const unsavePost = PostAPIs.unsavePost;
export const likePost = PostAPIs.likePost;
