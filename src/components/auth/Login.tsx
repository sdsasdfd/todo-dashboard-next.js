"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Input } from "../ui/input";
import Logo from "../logo/Logo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { signInWithGoogle } from "@/actions/auth";

const formSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
       setIsLoading(true);
      const response = await axios.post("/api/login", values);
      console.log("res of login ::", response.data);
      const data = response.data;
      if (response.status === 200) {
        toast.success(data.message);
        form.reset();
        router.push("/");
        setIsLoading(false);
        return console.log(data.message);
      } else {
        return toast.error(data.message);
        // return console.error("Login failed:", data.message);
      }
      // window.localStorage.setItem("user", JSON.stringify(values));
    } catch (error) {
      console.log("error", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin= async()=> {
    await signInWithGoogle()
  }
  return (
    <div className="container mx-auto h-full flex justify-center px-4">
      <div className="md:bg-silver mt-16 mb-6 px-10 py-6 md:rounded-sm md:border-1 md:border-medium-silver">
        <div className=" flex items-center justify-center">
          <Logo />
        </div>
        <div className=" text-center flex flex-col items-center justify-center mt-2">
          <span className=" font-bold text-3xl">Join our task</span>
          <p className="w-[60%] text-medium-gray text-[13px]">
            Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-3">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <div className=" mb-5">
                  <div className="border-1 border-medium-silver bg-white px-3 py-2 rounded-sm flex items-center">
                    <Input
                      placeholder="Email"
                      {...field}
                      className="w-full outline-none border-none shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <div className=" mb-5">
                  <div className="border-1 border-medium-silver bg-white px-3 py-2 rounded-sm flex items-center">
                    <Input
                      placeholder="Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="w-full outline-none border-none shadow-none focus-visible:ring-0"
                    />
                    {showPassword ? (
                      <FaRegEye
                        className="text-gray-300 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <FaRegEyeSlash
                        className="text-gray-300 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                  {fieldState.error && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
             <Button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer bg-dark-blue text-[17px] hover:bg-medium-blue mb-5"
            >
              {isLoading ? <Loader className="animate-spin" /> : ""} Login
            </Button>

            {/* Divider */}
            <div className="mb-4 flex items-center justify-center gap-1">
              <div className="bg-medium-gray md:w-[160px] w-[130px] h-[1px]"></div>
              <span className="text-[13px] font-normal">OR</span>
              <div className="bg-medium-gray md:w-[160px] w-[130px] h-[1px]"></div>
            </div>

            {/* Google Sign In Button */}
            <Button
              className="bg-white w-full border-1 border-medium-silver"
              variant="outline"
              type="button" onClick={handleGoogleLogin}
            >
              <div className="size-5 mb-1" >
                <Image
                  width={500}
                  height={500}
                  alt="google"
                  src="/images/google1.png"
                />
              </div>
              <span className="text-[14px] ml-2 text-dark-gray cursor-pointer">
                Sign in for Google
              </span>
            </Button>

            {/* Bottom link */}
            <div className="flex justify-center items-center text-[14px] mt-3 gap-1">
              <span className="text-medium-gray">Not a member yet?</span>
              <Link
                className="text-dark-blue font-semibold underline"
                href="/signup"
              >
                Sign Up Here
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
