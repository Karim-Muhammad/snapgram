import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

// ====================== USERS ======================
export const createNewUser = async (user: INewUser) => {
  try {
    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newUser) throw new Error("Failed to create new user, Try again!");

    const avatarUrl = avatars.getInitials(user.name);

    const User = await saveUserInDB({
      accountId: newUser.$id,
      name: newUser.name,
      username: user.username, // comes from the form
      email: newUser.email,
      imageUrl: avatarUrl,
    });

    return User;
  } catch (error) {
    // console.error("ERROR BRUH");
    if (error instanceof Error) return { error: error.message };
    else return { error: "Failed to create an account" };
  }
};

export const saveUserInDB = async (user: {
  accountId: string;
  name: string;
  username?: string;
  email: string;
  imageUrl: URL;
}) => {
  try {
    const savedUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return savedUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signInUser = async (user: { email: string; password: string }) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return { error: "Failed to sign in" };
  }
};

// Getting by Cookies and Sessions
export const getAccount = async () => {
  try {
    const currentAccount = await account.get();
    console.log("ACCOUNT DETAILS", currentAccount);

    return currentAccount;
  } catch (error) {
    console.log("Failed Getting Account", error);
  }
};

export const getCurrentUser = async () => {
  try {
    // 1#
    // Will get the current authenticated user from current session
    const account = await getAccount();
    if (!account) throw Error("Failed to get account");

    // 2#
    // Get user document from database
    const userDocument = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", account.$id)]
    );

    // Check if user document exists? stored in database or just in Auth?
    if (!userDocument) throw Error("Failed to get user document");

    // return userDocument;
    return userDocument.documents[0];
  } catch (error) {
    console.log("Failed in GetCurrentUser");
    if (error instanceof Error) console.log(error.message);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    const session = account.deleteSession("current");
    if (!session) throw Error;

    return session;
  } catch (error) {
    console.log("SignOut Failure!");
  }
};

// ====================== POSTS ======================

// General
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    console.log("Uploaded File", uploadedFile);
    if (!uploadedFile) throw Error;

    return uploadedFile;
  } catch (error) {
    console.log("Failed to upload file");
    console.log(error instanceof Error ? error.message : "kjkjkj");

    return null;
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log("Failed to get file preview");
    console.log(error instanceof Error ? error.message : "kjkjkj");
    return null;
  }
}

export async function deleteFile(fileId: string) {
  try {
    /* const deletedFile = */ await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );

    return { status: "success", message: "File deleted successfully" };
  } catch (error) {
    console.log("Failed to delete file");
    return null;
  }
}

export const createPost = async (post: INewPost) => {
  // First Upload the file to storage
  // Then save the post in database

  try {
    console.log(post.file);
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const filePreview = await getFilePreview(uploadedFile.$id);
    if (!filePreview) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        location: post.location,
        tags: post.tags?.replace(/ /g, "").split(","),
        imageId: uploadedFile.$id,
        imageUrl: filePreview,
      }
    );
    if (!savedPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return savedPost;
  } catch (error) {
    console.log("Failed to create post");
    return null;
  }
};

export const updatePost = async (post: IUpdatePost) => {
  console.log(post);
};

export const getRecentPosts = async () => {
  // Get the most recent posts
  try {
    const recentPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    if (!recentPosts) throw Error;

    return recentPosts;
  } catch (error) {
    console.log("Failed to get recent posts");
    return null;
  }
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updateDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updateDocument) throw Error;

    return updateDocument;
  } catch (error) {
    console.log("Failed to like post");
    return null;
  }
};

export const savePost = async (postId: string, userId: string) => {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        postId,
        userId,
      }
    );

    if (!savedPost) throw Error;

    return savedPost;
  } catch (error) {
    console.log("Failed to save post");
    return null;
  }
};

export const unsavePost = async (postId: string) => {
  try {
    const post = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log("Failed to unsave post");
    return null;
  }
};
