import { Models } from "appwrite";
import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="basis-1/3 flex flex-col gap-3 justify-center text-center">
      <img
        className="rounded-full w-16 h-16 mx-auto"
        src={user?.imageUrl}
        alt={`user-${user?.name}`}
      />
      <h3 className="h3-bold">{user?.name}</h3>
      <p className="text-sm">@{user?.username}</p>

      <Button className="bg-purple-500 hover:bg-purple-900">Follow</Button>
    </div>
  );
};

export default UserCard;
