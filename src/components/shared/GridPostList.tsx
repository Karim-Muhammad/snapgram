import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({ posts, showStats, showUser }: GridPostListProps) => {
  const { user } = useUserContext();
  // console.log("User", user);

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={`post-${post.$id}`} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post?.imageUrl}
              alt={post?.caption}
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post?.creator?.imageUrl}
                  alt={post?.caption}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <Link to={`/profile/${post?.creator?.$id}`}>
                  <p className="text-sm">{post?.creator?.name}</p>
                </Link>
              </div>
            )}

            {showStats && <PostStats post={post} currentUserId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
