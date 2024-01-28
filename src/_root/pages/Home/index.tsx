import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPostsQuery } from "@/lib/react-query/queries";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending, isError } = useGetRecentPostsQuery();
  console.log("Posts", posts);
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="home-container">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold w-full text-left">Posts Feed</h2>
        {isPending && !posts ? (
          <Loader />
        ) : (
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts?.documents?.map((post: Models.Document) => (
              <li key={post.$id} className="">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
