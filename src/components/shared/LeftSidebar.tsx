import React from "react";

import { NavLink, useLocation } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const location = useLocation();
  const { user } = useUserContext();

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 h-full">
        <NavLink to="/">
          <img src="/assets/images/logo.svg" width={170} height={36} />
        </NavLink>

        <div className="flex gap-3">
          <img src={user.imageUrl} className="w-11 h-11 rounded-full" />
          <div className="flex flex-col">
            <p>{user.name}</p>
            <p className="small-regular text-slate-600">@{user.username}</p>
          </div>
        </div>

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
          <NavLink to="/logout" className="leftsidebar-link">
            <div className="group flex gap-3 p-4 cursor-pointer">
              <img
                className="group-hover:invert-white"
                src="/assets/icons/logout.svg"
              />
              Logout
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
