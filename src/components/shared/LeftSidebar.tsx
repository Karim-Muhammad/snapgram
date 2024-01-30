import React from "react";

import { Link, NavLink, useLocation } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { useSignOutAccountMutation } from "@/lib/react-query/mutations";

const LeftSidebar = () => {
  const location = useLocation();
  const { user } = useUserContext();

  const { mutateAsync: signOut } = useSignOutAccountMutation();

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 h-full">
        <Link to="/">
          <img src="/assets/images/logo.svg" width={170} height={36} />
        </Link>

        <Link to={`/profile/${user.id}`}>
          <div className="flex gap-3">
            <img src={user.imageUrl} className="w-11 h-11 rounded-full" />
            <div className="flex flex-col">
              <p>{user.name}</p>
              <p className="small-regular text-slate-600">@{user.username}</p>
            </div>
          </div>
        </Link>

        <ul className="flex flex-col gap-6 h-full">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = location.pathname === link.route;

            return (
              <li
                key={link.label}
                className={`group leftsidebar-link ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-3 p-4 cursor-pointer"
                >
                  <img
                    src={link.imgURL}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-6">
          <div
            className="group flex gap-3 p-4 cursor-pointer"
            onClick={() => signOut()}
          >
            <img
              className="group-hover:invert-white"
              src="/assets/icons/logout.svg"
            />
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
