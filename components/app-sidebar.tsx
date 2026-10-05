"use client"

import * as React from "react"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, BookOpen, SquareTerminal, Bot, User, UsersRound } from "lucide-react"
import { NavMain } from "./nav-main";
import { usePathname } from "next/navigation";

const data = {
    navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Tasks",
      url: "/task",
      icon: Bot,
    },
    {
      title: "Projects",
      url: "/project",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/users",
      icon: UsersRound,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ],
  teams: [
    {
      name: "Task Manager",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const pathname = usePathname();
     const navItems = data.navMain.map((item) =>({
      ...item,
      isActive: item.url !== "#" && (pathname === item.url || pathname.startsWith(`${item.url}/`))
     }))
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
