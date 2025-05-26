"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Input } from "../ui/input";
import Logo from "../logo/Logo";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept terms and conditions",
  }),
});

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setIsLoading(true);
       const res = await axios.post("/api/signup", values);
      console.log("res of signup ::", res.data);
      if (res.data.success) {
        // User created successfully
        // You could redirect or show a success message
        toast.success(res.data.message);
        form.reset();
        return console.log(res.data.message);
       
      } else {
        // Handle expected failure (like user already exists, validation issues)
        toast.error(res.data.message);
        return console.error("Signup failed:", res.data.message);
      
      }
      
    } catch (err) {
       const error = err as AxiosError;

      if (error.response) {
        const message = (error.response.data as { message?: string }).message;
        console.log(message || "Something went wrong. Please try again.");
      } else {
        console.log("Network or server error. Please try again later.");
      }
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto h-full flex justify-center">
      <div className="md:bg-silver  mt-16 mb-6 px-10 py-6 md:rounded-sm md:border-1 md:border-medium-silver ">
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
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <div className=" mb-5">
                  <div className="border-1 border-medium-silver bg-white px-3 py-2 rounded-sm flex items-center">
                    <Input
                      placeholder="Name"
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

            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field, fieldState }) => (
                <div className=" mb-5">
                  <div className="items-top flex space-x-2">
                    <Checkbox
                      id="terms1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-[12px] text-medium-gray mt-[1px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the term & conditions
                      </label>
                    </div>
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
              type="submit"
              className="w-full cursor-pointer bg-dark-blue text-[17px] hover:bg-medium-blue mb-5"
            >
             {isLoading ? <Loader className="animate-spin" /> : ""} Sign Up
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
              type="button"
            >
              <div className="size-5 mb-1">
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
                href="/login"
              >
                Log In
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
