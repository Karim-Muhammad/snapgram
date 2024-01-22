import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID, Query } from "appwrite";

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
