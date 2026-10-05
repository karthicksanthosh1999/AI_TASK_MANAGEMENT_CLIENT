'use client';

import AuthProvider from '@/providers/AuthProvider';
import { ReactNode } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BadgeCheckIcon,
  LogOutIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { SessionProvider } from '@/providers/SessionProvider';

function layout({children} : {children: ReactNode}) {
  return (
    <SessionProvider>
        <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gray-900">
              <div className="flex items-center gap-2 px-4 justify-between w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                />
                <div className="flex w-full justify-between items-center uppercase">
                  <h1>Welcome back!</h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full cursor-pointer"><Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                        <AvatarFallback>JK</AvatarFallback>
                      </Avatar></Button>} />
                    <DropdownMenuContent align="end" >
                      <DropdownMenuGroup>
                        <Link href={'/profile'}>
                        <DropdownMenuItem>
                          <BadgeCheckIcon />
                          Account
                        </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOutIcon />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
        </AuthProvider>
    </SessionProvider>
  )
}

export default layout
