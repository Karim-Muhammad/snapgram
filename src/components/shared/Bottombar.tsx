import { NavLink, useLocation } from "react-router-dom";

import { sidebarLinks } from "@/constants";

const Bottombar = () => {
  const location = useLocation();

  return (
    <div className="bottom-bar">
      {sidebarLinks.map((link) => {
        const isActive = location.pathname === link.route;

        return (
          <NavLink
            key={link.label}
            to={link.route}
            className={`flex flex-col flex-center rounded-[10px] gap-1 p-2 cursor-pointer leftsidebar-link ${
              isActive && "bg-primary-500"
            }`}
          >
            <img
              src={link.imgURL}
              className={`group-hover:invert-white ${
                isActive && "invert-white"
              }`}
              width={17}
              height={17}
            />
            <span className="tiny-medium text-light-2">{link.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default Bottombar;
