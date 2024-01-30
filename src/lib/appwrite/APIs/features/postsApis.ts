import { ID, Query } from "appwrite";
import { appwriteConfig, databases, storage } from "../../config";
import { INewPost, IUpdatePost } from "@/types";
import { getCurrentUser } from "./authApis";

// ====================== POSTS ======================
// ---------------- Upload File
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

// ---------------- Get File Preview
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

// ---------------- Delete File
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

// ---------------- Create Post
export async function createPost(post: INewPost) {
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
}

// ---------------- Update Post
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  const image = {
    imageId: post.imageId, // old image id
    imageUrl: post.imageUrl, // old image url
  };

  try {
    if (hasFileToUpdate) {
      // First we delete the old file
      await deleteFile(post.imageId);

      // Then we upload the new file
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id); // delete the new file
        throw Error;
      }

      // Then we update the image object
      image.imageId = uploadedFile.$id;
      image.imageUrl = fileUrl;
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        ...image,
        caption: post.caption,
        location: post.location,
        tags: post.tags?.replace(/ /g, "").split(","),
      }
    );

    if (!updatePost) {
      // updated post had file? delete it
      if (hasFileToUpdate) deleteFile(image.imageId); // delete the new file
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log("Failed to update post");
    return null;
  }
}

// ---------------- Delete Post
export async function deletePost(postId: string) {
  try {
    // First we delete the file
    const post = await getPostById(postId);
    if (!post) throw Error;

    await deleteFile(post.imageId);

    // Then we delete the post
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    if (!deletedPost) throw Error;

    return deletedPost;
  } catch (error) {
    console.log("Failed to delete post");
    return null;
  }
}

// ---------------- Get Recent Posts
export async function getRecentPosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(2)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  // Get the most recent posts
  try {
    const recentPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!recentPosts) throw Error;

    return recentPosts;
  } catch (error) {
    console.log("Failed to get recent posts");

    throw Error("Failed to get recent posts!");
    // return null;
  }
}

// ---------------- Get Infinite Posts
// WHy i defined as { pageParam }?
// https://react-query.tanstack.com/guides/infinite-queries#using-the-pageparam

// -- because this function is called by react-query (useInfiniteQuery)
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(3)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Get Post by ID
export async function getPostById(id?: string) {
  if (!id) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log("Failed to get post by ID");
    return null;
  }
}

// Get Post By Tag (related posts)
export async function getPostByTag(tag: string) {
  if (!tag) throw Error;

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("tags", tag)]
    );

    if (!posts) throw Error;

    return posts.documents;
  } catch (error) {
    console.log("Failed to get post by tag");
  }
}

// Get Posts by User
// export async function getPostsByUser() {
//   try {
//     const user = await getCurrentUser();
//     if (!user) throw Error;

//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.equal("creator", user.$id)]
//     );
//     if (!posts) throw Error;

//     return posts;
//   } catch (error) {
//     console.log("Failed to get posts by user");
//   }
// }

// Get Liked Posts User

// ---------------- Like Post
export async function likePost(postId: string, likesArray: string[]) {
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
  }
}

// ---------------- Save Post
export async function savePost(postId: string, userId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId, // to try something wrong in this function, remove `user:`
      }
    );

    if (!savedPost) throw Error;

    return savedPost;
  } catch (error) {
    console.log("Failed to save post");
    if (error instanceof Error) console.log(error.message);

    throw Error;
    return null;
  }
}

// ---------------- Unsave Post
export async function unsavePost(postId: string) {
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
}

// ---------------- Get Saved Posts
export async function getSavedPosts() {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error;

    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", user?.$id)]
    );

    if (!savedPosts) throw Error;

    return savedPosts.documents;
  } catch (error) {
    console.log("Failed to get saved posts");
  }
}

// ---------------- Comment on Post
// export const commentOnPost = async (postId: string, comment: string) => {
//   try {
//     const commentDocument = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.commentsCollectionId,
//       ID.unique(),
//       {
//         postId,
//         comment,
//       }
//     );

//     if (!commentDocument) throw Error;

//     return commentDocument;
//   } catch (error) {
//     console.log("Failed to comment on post");
//     return null;
//   }
// };

// ---------------- Get Search Results

export async function getSearchResults(searchQuery: string) {
  if (!searchQuery) throw Error;

  try {
    const searchQueryResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchQuery), Query.orderDesc("$createdAt")]
    );

    return searchQueryResults;
  } catch (error) {
    if (searchQuery)
      console.log(`Failed to get search results for ${searchQuery}`);
    else console.log("Failed to get search results");
  }
}

const PostApis = {
  deleteFile,
  createPost,
  updatePost,
  deletePost,
  getRecentPosts,
  getInfinitePosts,
  getPostById,
  getSearchResults,
  likePost,
  savePost,
  unsavePost,
  getSavedPosts,
};

export default PostApis;
