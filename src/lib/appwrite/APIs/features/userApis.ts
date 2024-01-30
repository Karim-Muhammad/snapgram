import { Query } from "appwrite";
import { appwriteConfig, databases } from "../../config";

export async function getUsers({ pageParam }: { pageParam: number }) {
  const query = [Query.limit(9)];
  if (pageParam) {
    query.push(Query.cursorAfter(pageParam.toString())); // to get the next page (infinite scroll)
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      query
    );
    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log("Error getting users: ", error);
  }
}
