import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";

import useDebounce from "@/hooks/useDebounce";
import {
  useGetInfinitePostsQuery,
  useGetSearchResultsQuery,
} from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchResult: any;
};

const SearchResult = ({
  isSearchFetching,
  searchResult,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!searchResult || searchResult?.documents?.length === 0) {
    return (
      <div className="flex-center w-full h-full">
        <p>No results found</p>
      </div>
    );
  }

  return <GridPostList posts={searchResult.documents} showUser={true} />;
};

const Explore = () => {
  // State for searching
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue, 500);

  const { ref, inView } = useInView();

  const { data: searchResultPosts, isPending: searching } =
    useGetSearchResultsQuery(debounceValue);

  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePostsQuery();

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView]);

  console.log("POSTS", posts);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts?.pages.some((post) => post.documents.length !== 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold text-left w-full">Search Posts</h2>

        <div className="flex gap-1 w-full bg-dark-4 border-dark-4/50 rounded-lg px-4">
          <img src="/assets/icons/search.svg" width={25} height={25} />
          <Input
            className="explore-search"
            placeholder="Search for posts"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full flex-between max-w-5xl mt-16 mb-6">
        <h3>Popular Today</h3>

        <div className="flex-center gap-3 rounded-lg cursor-pointer bg-dark-3 px-4 py-2">
          <p className="small-medium md:base-regular text-light-2">All</p>
          <img src="/assets/icons/filter.svg" />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResult
            isSearchFetching={searching}
            searchResult={searchResultPosts}
          />
        ) : !shouldShowPosts ? (
          <p>End of posts</p>
        ) : (
          posts.pages.map((page, index) => (
            <GridPostList
              key={`page-${index}`}
              posts={page.documents}
              showUser={true}
              showStats={true}
            />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="flex-center w-full mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
