"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-2 aspect-square size-8 items-center justify-start rounded-lg text-sidebar-primary-foreground w-full cursor-pointer mt-2">
          <Image src={'/logo.png'}  alt="logo" width={49} height={49} title="Jk-Industries" />
        <div>
          <h1 className="text-white font-semibold">Task Manager</h1>
          <p className="text-gray-400 text-xs">Ai-Powered App</p>
        </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
