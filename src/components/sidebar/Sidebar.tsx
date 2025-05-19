import React from "react";
import Logo from "../logo/Logo";
import { BiCustomize } from "react-icons/bi";

const Sidebar = () => {
  return (
    <div
      className="w-[150px] md:w-[200px] lg:w-[250px] md:flex hidden text-white 
    flex-col mt-6 "
    >
      <Logo />
      <div className=" mt-6 w-full bg-medium-blue flex items-center gap-2 py-1 px-2 rounded-md text-lg">
        <BiCustomize />
        Dashboard
      </div>
    </div>
  );
};

export default Sidebar;
