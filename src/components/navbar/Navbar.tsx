import React from "react";
import Logo from "../logo/Logo";

import ProfileDropDown from "../dashboard/ProfileDropDown";

const Navbar = () => {
  return (
    <div className=" md:hidden h-[55px] text-white flex justify-between items-center px-3 bg-dark-blue">
      <Logo />
      <div>
        <ProfileDropDown />
      </div>
    </div>
  );
};

export default Navbar;
