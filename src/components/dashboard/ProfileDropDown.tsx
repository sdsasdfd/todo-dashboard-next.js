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

import axios from "axios";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface User {
  email: string;
  full_name: string;
}

const ProfileDropDown = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log("user does not exist");
      } else {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError) {
          console.log("Error fetching user data: ", userError);
        }
        if (userData) {
          setUser(userData);
        }
      }
    };
    getUser();
  }, []);
  console.log(user);

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.status === 200) {
        toast.success(response.data.message);
        router.push("/login");
        return console.log(response.data.message);
      }
    } catch (error) {
      console.log("Failed to Logout", error);
      toast.error("Failed to Logout");
    }
    // localStorage.removeItem("user");
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
          {user?.full_name}
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
