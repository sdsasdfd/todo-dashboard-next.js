import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

const Dashboard = () => {
  return (
    <div className=" bg-dark-blue  w-full">
      <div className=" flex md:flex-row flex-col 2xl:w-[1536px] mx-auto md:px-3 md:pt-4 md:gap-6">
        <Navbar />
        <Sidebar />
        <DashboardLayout />
      </div>
    </div>
  );
};

export default Dashboard;
