import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsersQuery } from "@/lib/react-query/queries";

const AllUsers = () => {
  const { user } = useUserContext();
  const currentUserId = user?.id;

  const { data: users, hasNextPage, fetchNextPage } = useGetUsersQuery();
  console.log(users);
  return (
    <div className="w-4/5 mx-auto my-5">
      <h2 className="h3-bold md:h2-bold">All Users</h2>
      <ul className="flex justify-center flex-1 flex-wrap gap-5">
        {users?.pages.map((page) =>
          page?.documents.map(
            (user) => user.$id !== currentUserId && <UserCard user={user} />
          )
        )}
      </ul>

      {hasNextPage && (
        <div className="grid place-content-center my-10">
          <button
            className="w-fit mx-auto py-2 px-4 rounded-md mt-5 bg-purple-500 hover:bg-purple-900"
            onClick={() => fetchNextPage()}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
