"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDate } from "@/lib/formatDate";
import axios from "axios";
import { Loader } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  description: z.string().min(6, {
    message: "Description must be at least 6 characters.",
  }),
});

interface Data {
  id: number;
  title: string;
  description: string;
  created_at: string;
  is_completed: boolean;
}

type Props = {
  data: Data;
  editHandle: () => void;
  onDelete: () => void;
  onCompleted: () => void;
};

const TaskCard: React.FC<Props> = ({
  data,
  editHandle,
  onDelete,
  onCompleted,
}) => {
  const [editTask, setEditTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const prettyDate = formatDate(data.created_at);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
 
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, data.id);


    try {
      setIsLoading(true);
      console.log({ ...values, id: data.id });
      await axios.put("/api/task", { ...values, id: data.id });

      toast.success("Task updated successfully");
      setEditTask(false);
      editHandle();
      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.description,
      });
    }
  }, [data, form]);

  const handleDelete = async (id: number) => {
  
    await axios.delete("/api/task", { data: { id } });
    toast.success("Task deleted successfully");

    onDelete();
  };

  const handleCompleted = async (id: number) => {
   
    const res = await axios.patch("/api/task", { id });
    toast.success("Task completed successfully");
    console.log("Updated task:", res.data);
    onCompleted();
  };

  return (
    <div>
      {editTask ? (
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
                        className=" border-1 border-medium-silver first-letter:capitalize"
                        placeholder="Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="  grid grid-cols-1 md:grid-cols-2 md:gap-2  ">
                <Button
                  className=" bg-dark-blue hover:bg-medium-blue  mt-2 cursor-pointer"
                  type="submit"
                >
                  {isLoading ? <Loader className="animate-spin" /> : ""}
                  Update Task
                </Button>
                <Button
                  className="cursor-pointer bg-silver hover:bg-silver text-black mt-2"
                  onClick={() => setEditTask(false)}
                >
                  Cancel Task
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div
          className={` px-2 py-2 border-1  rounded-md ${
            data.is_completed
              ? "bg-green-50 border-green-600"
              : "bg-white border-medium-silver"
          }`}
        >
          <div className=" flex items-center justify-between mb-2">
            <h2 className=" font-medium text-xl first-letter:capitalize">
              {data.title}
            </h2>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BsThreeDotsVertical className=" text-medium-gray cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30 px-2 font-medium ">
                  {!data.is_completed && (
                    <DropdownMenuItem
                      onClick={() => handleCompleted(data.id)}
                      className=" hover:bg-green-200 p-2 rounded-md cursor-pointer  focus:bg-green-200"
                    >
                      Completed
                    </DropdownMenuItem>
                  )}
                  {!data.is_completed && (
                    <DropdownMenuItem
                      onClick={() => setEditTask(true)}
                      className=" hover:bg-silver p-2 rounded-md cursor-pointer  focus:bg-silver"
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="hover:!text-white p-2 cursor-pointer  hover:bg-red-500  focus:bg-red-500"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className=" text-medium-gray mb-5 first-letter:capitalize">
            {data.description}
          </p>
          <span className="text-medium-gray">{prettyDate}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
