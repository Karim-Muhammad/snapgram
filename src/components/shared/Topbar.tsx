import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccountMutation } from "@/lib/react-query/mutations";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOutAccount, isSuccess } = useSignOutAccountMutation();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar p-3">
      <div className="flex flex-between">
        <Link to={"/"}>
          <img src="/assets/images/logo.svg" width={130} height={325} />
        </Link>

        <div className="flex items-center gap-2">
          <Button onClick={() => signOutAccount()}>
            <img src="/assets/icons/logout.svg" />
          </Button>

          <div>
            <Link to={`/profile/${user.id}`}>
              <img
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
