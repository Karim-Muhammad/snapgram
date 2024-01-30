import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const owner = post?.creator?.$id === user.id;

  // console.log("post", post);
  // console.log("user", user);

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creator?.$id}`}>
            <img
              src={post?.creator?.imageUrl}
              alt={post?.creator?.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.creator?.name}
            </p>
            {/* Creator Name */}
            <div className="flex text-light-4 items-center">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>
            </div>
            {/* Info */}
          </div>
        </div>
        {/* Edit if own post */}
        {owner && (
          <Link to={`/posts/edit?id=${post.$id}`}>
            <img src="/assets/icons/edit.svg" alt="Edit" className="w-5 h-5" />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="">
          <p className="my-3">{post?.caption}</p>
          <ul className="flex gap-2">
            {post?.tags?.map((tag: string) => (
              <li
                key={tag}
                className="subtle-semibold lg:small-regular text-light-4"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post?.imageUrl}
          alt={post?.caption}
          className="w-full h-96 object-cover rounded-2xl"
        />
      </Link>

      <PostStats post={post} currentUserId={user.id} />
    </div>
  );
};

export default PostCard;
