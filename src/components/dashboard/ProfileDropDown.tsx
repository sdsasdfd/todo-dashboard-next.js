"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
};
const ProfileDropDown = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") ?? "{}"));
  }, []);
  // console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/signup");
    setUser(null);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="cursor-pointer"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-50 text-center bg-silver"
        align="end"
        sideOffset={10}
      >
        <DropdownMenuItem className=" flex hover:bg-transparent focus:bg-transparent items-center justify-center mt-3 mb-1 ">
          <Avatar className=" ">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className=""
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuItem>
        <DropdownMenuItem className=" font-medium text-lg hover:bg-transparent focus:bg-transparent flex items-center justify-center">
          {user?.name}
        </DropdownMenuItem>
        <DropdownMenuItem className=" text-medium-gray pb-2 hover:bg-transparent focus:bg-transparent flex items-center justify-center">
          {user?.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className=" text-medium-gray py-1 cursor-pointer hover:bg-transparent focus:bg-transparent flex items-center justify-center"
          onClick={handleLogout}
        >
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
