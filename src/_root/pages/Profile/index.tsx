import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";
import { useGetUserQuery } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: user } = useGetUserQuery();
  console.log("User", user);

  const [showLikedPosts, setShowLikedPosts] = useState(false);

  // const { data: likedPosts } = useGetLikedPost();
  // const { data: postsOfUser } = useGetPostsByUser();
  const posts = user?.posts?.map((post: Models.Document) => ({
    ...post,
    save: [
      {
        user: user,
      },
    ],
  }));

  console.log("User POSTS", posts);

  return (
    <div className="my-7 flex flex-col items-center flex-1 w-full">
      <div className="flex w-full justify-center items-center gap-3">
        <div className="flex items-center gap-3 justify-self-start">
          {/* Left - Image */}
          <div className="w-24 h-24">
            <img
              src={user?.imageUrl}
              alt={`image-${user?.name}`}
              className="rounded-full object-cover"
            />
          </div>

          {/* Right - User Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="h3-bold md:h2-bold">{user?.name}</h3>
              <p className="tiny-medium md:small-regular text-slate-600">
                @{user?.username}
              </p>
            </div>
            {/*  */}
            <div className="flex gap-3">
              {/* Posts */}
              <p className="small-medium md:base-regular">
                <span className="text-purple-500">0</span> Posts
              </p>
              {/* Followers */}
              <p className="small-medium md:base-regular">
                <span className="text-primary-500">0</span> Followers
              </p>
              {/* Following */}
              <p className="small-medium md:base-regular">
                <span className="text-primary-500">0</span> Following
              </p>
            </div>
          </div>
        </div>

        <div className="">
          <Link
            to={`/profile/edit/${user?.$id}`}
            className="w-fit ml-auto bg-dark-4/80 text-light-2 flex items-center px-4 py-2 rounded-md gap-2"
          >
            <img src="/assets/icons/edit.svg" width={20} height={20} />
            Edit Profile
          </Link>
        </div>
      </div>
      <div className="w-1/2 my-7 flex gap-3 items-center">
        <Button
          className="flex gap-3 items-center"
          onClick={() => setShowLikedPosts(false)}
        >
          <img src="/assets/icons/posts.svg" />
          Posts
        </Button>
        <Button
          className="flex gap-3 items-center"
          onClick={() => setShowLikedPosts(true)}
        >
          <img src="/assets/icons/like.svg" />
          Liked Posts
        </Button>
      </div>
      <div className="mt-10">
        {!showLikedPosts ? (
          <GridPostList posts={posts} showStats={true} />
        ) : (
          <GridPostList posts={user?.liked} showUser={true} />
        )}
      </div>
    </div>
  );
};

export default Profile;
