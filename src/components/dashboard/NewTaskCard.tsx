"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { Loader } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  description: z.string().min(6, {
    message: "Title must be at least 6 characters.",
  }),
});

// type Task = {
//   id: number;
//   title: string;
//   description: string;
//   created_at: number;
//   is_completed: boolean;
// };

interface Props {
  onSuccess: () => void;
  handleTaskCard: (show: boolean) => void;
}

const NewTaskCard: React.FC<Props> = ({ onSuccess, handleTaskCard }) => {
   const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
   

    try {
      setIsLoading(true);
      const res = await axios.post("/api/task", values);

      onSuccess();
      setIsLoading(false);
      return res.data;
    
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className=" px-2 py-2 border-1 border-medium-silver rounded-md bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input
                    className=" border-1 border-medium-silver"
                    placeholder="Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className=" border-1 border-medium-silver"
                    placeholder="Description"
                    {...field}
                    minLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="  grid grid-cols-1 md:grid-cols-2 md:gap-2  ">
            <Button
              disabled={isLoading}
              className=" bg-dark-blue hover:bg-medium-blue mt-2 cursor-pointer"
              type="submit"
            >
              {isLoading ? <Loader className="animate-spin" /> : ""} Submit
            </Button>
            <Button
              className="cursor-pointer bg-silver hover:bg-silver text-black mt-2"
              onClick={() => handleTaskCard(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewTaskCard;
