import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostByIdQuery } from "@/lib/react-query/queries";
import { useSearchParams } from "react-router-dom";

const UpdatePost = () => {
  const [searchParams] = useSearchParams();
  console.log("Search Params", searchParams.get("id"));

  const postId = searchParams.get("id") as string;

  const { data: post, isLoading } = useGetPostByIdQuery(postId);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start w-full gap-3">
          <img src="/assets/icons/add-post.svg" />
          <h2 className="h3-bold md:h2-bold w-full">Update Post</h2>
        </div>

        {isLoading && <Loader />}
        {!isLoading && post && <PostForm action="Update" post={post} />}
      </div>
    </div>
  );
};

export default UpdatePost;
