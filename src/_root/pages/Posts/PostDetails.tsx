import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePostMutation } from "@/lib/react-query/mutations";
import {
  useGetPostByIdQuery,
  useGetPostByTagQuery,
} from "@/lib/react-query/queries";
import { formatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostByIdQuery(id || "");
  const { mutate: deletePost } = useDeletePostMutation(id || "");

  const { data: relatedPosts } = useGetPostByTagQuery(post?.tags || "");

  const { user } = useUserContext();

  const owner = post?.creator?.$id === user.id;

  const handleDeletePost = () => {
    deletePost();
  };

  if (isPending)
    return (
      <div className="flex flex-center bg-slate-600">
        <Loader /> Fetching post...
      </div>
    );

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <img className="post_details-img" src={post?.imageUrl} />

        <div className="post_details-info">
          <div className="flex-between w-full">
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
                    {formatDateString(post?.$createdAt || "")}
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
              <div className="flex items-center gap-1">
                <Link to={`/posts/edit?id=${post?.$id}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    className="w-5 h-5"
                  />
                </Link>

                <Button onClick={handleDeletePost}>
                  <img
                    src="/assets/icons/delete.svg"
                    alt="Delete"
                    className="w-5 h-5"
                  />
                </Button>
              </div>
            )}
          </div>

          <hr className="border border-dark-4/80 w-full" />

          <div className="flex flex-col flex-1 small-medium lg:base-regular">
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

          {relatedPosts && <GridPostList posts={relatedPosts} />}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
