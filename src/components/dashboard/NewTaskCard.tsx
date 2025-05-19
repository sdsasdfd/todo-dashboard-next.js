"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

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

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  description: z.string().min(6, {
    message: "Title must be at least 6 characters.",
  }),
});

type Task = {
  id: number;
  title: string;
  description: string;
  date: number;
};

interface Props {
  tasks: Task[];
  onSuccess: () => void;
}

const NewTaskCard: React.FC<Props> = ({ tasks, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    let formattedTasks: Task[] = [];
    const prevTasks = localStorage.getItem("tasks");
    if (prevTasks) {
      formattedTasks = JSON.parse(prevTasks);
    }

    const newTask = {
      ...values,
      id: Math.floor(Math.random() * 1000000),
      date: Date.now(),
    };

    try {
      localStorage.setItem(
        "tasks",
        JSON.stringify([...formattedTasks, newTask])
      );
      onSuccess();
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
          <Button
            className=" bg-dark-blue hover:bg-medium-blue w-full mt-2"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewTaskCard;
