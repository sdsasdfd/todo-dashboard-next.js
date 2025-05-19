"use client";
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
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDate } from "@/lib/formatDate";

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  description: z.string().min(6, {
    message: "Description must be at least 6 characters.",
  }),
});

type Data = {
  id: number;
  title: string;
  description: string;
  date: number;
};

type Props = {
  data: Data;
  editHandle: () => void;
  onDelete: () => void;
};

const TaskCard: React.FC<Props> = ({ data, editHandle, onDelete }) => {
  const [editTask, setEditTask] = useState(false);
  const prettyDate = formatDate(data.date);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const prevTasks = localStorage.getItem("tasks");
    if (!prevTasks) return;

    try {
      const parsedTask: Data[] = JSON.parse(prevTasks);

      const updatedTasks = parsedTask.map((task) =>
        task.id === data.id
          ? { ...task, title: values.title, description: values.description }
          : task
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setEditTask(false);
      editHandle();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = (id: number) => {
    const prevTasks = localStorage.getItem("tasks");
    if (!prevTasks) return;
    const tasks = JSON.parse(prevTasks);
    const updatedTasks = tasks.filter((task: { id: number }) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    onDelete();
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
                        className=" border-1 border-medium-silver"
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
        <div className=" px-2 py-2 border-1 border-medium-silver rounded-md bg-white">
          <div className=" flex items-center justify-between mb-2">
            <h2 className=" font-medium text-xl">{data.title}</h2>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BsThreeDotsVertical className=" text-medium-gray cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30 px-2 font-medium ">
                  <DropdownMenuItem
                    onClick={() => setEditTask(true)}
                    className=" hover:bg-silver p-2 rounded-md cursor-pointer  focus:bg-silver"
                  >
                    Edit
                  </DropdownMenuItem>
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
          <p className=" text-medium-gray mb-5">{data.description}</p>
          <span className="text-medium-gray">{prettyDate}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
