import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useSavedPostsQuery } from "@/lib/react-query/queries";

const SavedPosts = () => {
  // const { data: user, isPending } = useGetUserQuery();
  // const posts = user?.save;

  const { data: posts, isPending } = useSavedPostsQuery();
  // console.log("Posts", posts);

  const SavedPosts = posts?.map((post) => {
    return {
      ...post.post,
      save: [
        {
          user: post.user,
        },
      ],
    };
  });
  console.log("Saved Posts", SavedPosts);

  return (
    <div className="home-container">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold w-full text-left">Saved Posts</h2>
        {isPending && !posts ? (
          <Loader />
        ) : (
          <GridPostList posts={SavedPosts} showStats={true} showUser={true} />
        )}
      </div>

      {/* {hasNextPage && (
        <div ref={ref} className="mt-7">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default SavedPosts;
