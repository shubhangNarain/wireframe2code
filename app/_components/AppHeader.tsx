import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import ProfileAvatar from "./ProfileAvatar";
import Link from "next/link";

function AppHeader({ hideSidebar = false }) {
  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full ">
      {!hideSidebar ? <SidebarTrigger /> : (
        <Link href={'/dashboard'} className="hidden md:flex font-bold text-lg hover:text-primary transition duration-300">Dashboard</Link>
      )}
      <ProfileAvatar />
    </div>
  );
}

export default AppHeader;
