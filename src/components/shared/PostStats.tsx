import {
  useLikePostMutation,
  useSavePostMutation,
  useUnsavePostMutation,
} from "@/lib/react-query/mutations";
import { useGetUserQuery } from "@/lib/react-query/queries";
import { checkIfUserLikedPost } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  currentUserId: string;
};

const PostStats = ({ post, currentUserId }: PostStatsProps) => {
  // preconfigure the state
  /**
   * @description
   * 1. Get the current user
   * 2. Get the list of users who liked the post
   * 3. Check if the current user is in the list
   * 4. If yes, show the liked icon
   * 5. If no, show the unliked icon
   * 6. If the user clicks on the icon, toggle the icon
   */
  const { data: currentUser } = useGetUserQuery();

  const _likedList: string[] = post?.likes.map(
    (user: Models.Document) => user.$id
  );

  // Likes State
  const [likedList, setLikedList] = useState(_likedList);

  // preconfigure the state
  const _userSaved = post?.save?.find(
    (pivot: Models.Document) => pivot?.user?.$id === currentUserId
  );

  const currentPostDocumentID = currentUser?.save?.find(
    (record: Models.Document) => record?.post?.$id === post.$id
  )?.$id;

  console.log("Current Post Document", currentPostDocumentID);

  // Saves State
  const [isSaved, setIsSaved] = useState(_userSaved);

  // APIs calls
  const { mutateAsync: likePost /*isPending: isLikingPost*/ } =
    useLikePostMutation();

  const { mutateAsync: savePost, isPending: isSavingPost } =
    useSavePostMutation();

  const { mutateAsync: unsavePost, isPending: isUnsavingPost } =
    useUnsavePostMutation();

  // Handling Buttons
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // if user has liked the post
    let _TLikedList = [...likedList];

    // console.log(checkIfUserLikedPost(likedList, currentUserId));

    if (checkIfUserLikedPost(likedList, currentUserId)) {
      console.log("User has liked the post");
      // remove the user from the list
      _TLikedList = _TLikedList.filter(
        (userId: string) => userId !== currentUserId
      );
    } else {
      console.log("User has not liked the post");
      // add the user to the list
      _TLikedList.push(currentUserId);
    }

    setLikedList(_TLikedList);
    likePost({ postId: post.$id, likesArray: _TLikedList });
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Post ID", post.$id);

    // if user has saved the post
    if (isSaved) {
      // remove the user from the list
      setIsSaved(false);
      // return unsavePost(post.$id);
      return unsavePost(currentPostDocumentID);
    }
    // add the user to the list
    setIsSaved(true);

    savePost({ postId: post.$id, userId: currentUserId }).catch((error) => {
      console.log("Error in saving", error);
      setIsSaved(false);
      // "Optimistic UI Update" Pattern
    });
  };

  // useEffect(() => {
  //   console.log("Error in Saving", errorInSaving);
  //   if (errorInSaving) {
  //     setIsSaved(false);
  //   }
  // }, [errorInSaving]);

  return (
    <div className="flex justify-between my-3">
      <div className="flex items-center gap-3 mr-6">
        <img
          onClick={handleLike}
          src={
            checkIfUserLikedPost(likedList, currentUserId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="likes"
        />
        <p className="subtle-semibold lg:small-regular text-white">
          {likedList?.length}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {(isSavingPost || isUnsavingPost) && <Loader />}
        {!isSavingPost && !isUnsavingPost && (
          <img
            onClick={handleSave}
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="comments"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
