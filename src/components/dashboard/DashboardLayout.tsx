"use client";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import TaskCard from "./TaskCard";
import ProfileDropDown from "./ProfileDropDown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewTaskCard from "./NewTaskCard";

import { DateRange } from "react-day-picker";
import { Skeleton } from "../ui/skeleton";

import { toast } from "sonner";


interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;

  is_completed: boolean;
}

interface User{
  id: number
}

const DashboardLayout = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [date, setDate] = useState<DateRange | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterTasks, setFilterTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async()=> {
    try {
      const res = await axios.get("/api/user");
      if(res.data.user){
        setUserData(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(()=> {
getUserData()
  },[])


  const fetchTasks = async () => {
    
    setIsLoading(true);
    try {
      const res = await axios.get("/api/task" );
      console.log("res of tasks from the database ::", res.data);
      setFilterTasks(res.data);
      setTasks(res.data);
      console.log("loaded from back", res.data);
    } catch {
      console.log("Something went wrong during fetch tasks!");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    console.log("use Effect run for fetch tasks.....");
    fetchTasks();
  }, []);

  const handleSuccess = () => {
    fetchTasks();
    console.log("handle success");
    setShowNewTaskCard(false);
  };

  const handleSearch = async(searchQuery: string) => {
    console.log("searchQuery", searchQuery);
    if(searchQuery && searchQuery.trim() !== "") {
      const res = await axios.get(`/api/task?search=${searchQuery}`);
    // if (searchQuery) {
    //   const finalSearchValue = searchQuery.trim().toLowerCase();
    //   const filterTask = tasks.filter((task) => {
    //     return task.title.toLocaleLowerCase().includes(finalSearchValue);
    //   });
    //   console.log("fitler", filterTask);
      setFilterTasks(res.data);
    } else {
      setFilterTasks(tasks);
    }
  };

  // useEffect to debounce search
  useEffect(() => {
    if (tasks.length === 0) return;

    const timer = setTimeout(() => {
      handleSearch(searchValue);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer); // Clear on new keystroke
  }, [searchValue]);

  // Filter tasks by selected date range
  const filterTasksByDateRange = async(range: DateRange | undefined) => {
    console.log("date now");
    console.log("range::", range?.from?.toISOString(), "to::", range?.to?.toISOString()); 
    try {
   if(range?.from && range?.to){

     const res = await axios.get(`/api/task?from=${range?.from?.toISOString()}&to=${range?.to?.toISOString()}`);
     setFilterTasks(res.data);
   }else{
    toast.info("Please select end date")
   }
   
    } catch (error) {
      console.error("Error filtering tasks by date range:", error);
    }
    
    // if (!range?.from) {
    //   const response = await axios.get('/api/filter-task', {
    //   params: {
    //     from: new Date(0).toISOString(), // Start from Unix epoch
    //     to: new Date().toISOString(),
    //     userId,
    //   },
    // });

    // setFilterTasks(response.data.tasks);
    // return;
    // }
    // const fromTime = range.from.getTime();
    // const toTime = range.to ? range.to.getTime() : fromTime;
    // console.log("fromTime::", fromTime, "toTime::", toTime);
    // const from = range.from.toISOString();
    // const to = range.to?.toISOString()
    // const response = await axios.get("/api/filter-task", {params: {userId, from, to}})
    // const filtered = tasks.filter((task) => {
    //   // Convert task.date string to Date
    //   const taskDate = new Date(task.created_at);
    //   const taskTime = taskDate.getTime();
    //   console.log("taskTime::", taskTime, "taskDate::", taskDate);
    //   return taskTime >= fromTime && taskTime <= toTime;
    // });
    // console.log("in date function");
    // setFilterTasks(response.data.tasks);
  };

  // Updated onSelect handler to set date and filter tasks
  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    console.log("handle Date select function...");
    // if(!userData?.id) return
    filterTasksByDateRange(range);
  };

  console.log("filterTasks", filterTasks);
  console.log("tasks", tasks);
  console.log('userData', userData);

  return (
    <div className=" bg-white pt-6  min-h-screen w-full md:rounded-t-md md:px-4 lg:px-6 px-2">
      <div className=" md:flex hidden  items-center justify-between">
        <h1 className="text-3xl font-medium ">My Todo</h1>
        <div className=" flex items-center gap-3">
          <button
            onClick={() => setShowNewTaskCard(!showNewTaskCard)}
            className=" flex items-center bg-dark-blue text-white rounded-sm px-3 py-2 gap-1 cursor-pointer"
          >
            <IoIosAddCircleOutline className=" text-2xl" />
            <span className=" text-[16px]">New task</span>
          </button>
          <ProfileDropDown />
        </div>
      </div>
      {/* Search Bar */}
      <div className=" flex md:flex-row flex-col gap-3 md md:items-center justify-between my-4">
        <div className="flex items-center w-full gap-2">
          <div className=" flex items-center border-1 border-medium-silver pl-4 pr-2 py-2 rounded-[4px] lg:w-[30%] md:w-[60%] w-[90%]">
            <input
              type="search"
              placeholder="Search"
              className=" outline-none w-[90%]"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <CiSearch
              className=" size-6 cursor-pointer text-dark-blue"
              onClick={() => handleSearch(searchValue)}
            />
          </div>

          <div
            className=" text-white bg-dark-blue w-fit md:hidden inline-block p-2 rounded-full cursor-pointer"
            onClick={() => setShowNewTaskCard(!showNewTaskCard)}
          >
            <IoIosAddCircleOutline className=" text-2xl" />
          </div>
        </div>

        {/* Calendar */}
        <div className={cn("grid gap-2 ", className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "md:w-[100%] w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className=" bg-silver rounded-sm md:px-4 px-5 pt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-4">
        {/* Card */}
        {showNewTaskCard && (
          <NewTaskCard
            handleTaskCard={setShowNewTaskCard}
            onSuccess={handleSuccess}
          />
        )}
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md shadow-sm space-y-3"
            >
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))
        ) : filterTasks?.length > 0 ? (
          filterTasks.map((task, index) => (
            <TaskCard
              key={index}
              editHandle={fetchTasks}
              onDelete={fetchTasks}
              onCompleted={fetchTasks}
              data={task}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No task available
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
