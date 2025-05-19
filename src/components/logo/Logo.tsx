import Link from "next/link";
import React from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center md:gap-4 gap-2 ">
      <RiCheckboxMultipleBlankLine className="size-7 " />
      <h1 className=" font-bold lg:text-4xl text-3xl ">
        Tik <span className=" text-light-blue">Tik</span>
      </h1>
    </Link>
  );
};

export default Logo;
