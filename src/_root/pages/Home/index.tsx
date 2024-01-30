import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPostsQuery } from "@/lib/react-query/queries";

const Home = () => {
  const { ref, inView } = useInView();

  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    isLoadingError,
  } = useGetRecentPostsQuery();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isError || isLoadingError) {
    return (
      <div className="text-center text-white bg-red px-4 py-2">
        Error - Something went wrong
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold w-full text-left">Posts Feed</h2>
        {isPending && !posts ? (
          <Loader />
        ) : (
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts?.pages?.map((page) => {
              return page.documents.map((post: Models.Document) => (
                <li key={post.$id} className="">
                  <PostCard post={post} />
                </li>
              ));
            })}
          </ul>
        )}
      </div>

      {hasNextPage && (
        <div ref={ref} className="mt-7">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Home;
