"use client"

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubItem,
   SidebarMenuSubButton,
   useSidebar
} from "@/components/ui/sidebar"

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"

import {
   BookUser,
   CalendarSearch,
   Handshake,
   Home,
   Network,
   Plus
} from "lucide-react"

import { usePathname } from "next/navigation";
import Link from "next/link"
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";

// Menu items.
const items = [
   // {
   //    title: "Koti",
   //    url: "/dashboard",
   //    icon: (isActive) => (
   //       <Home
   //          className={cn("!w-5 !h-5 mr-1", isActive && "text-indigo-500")}
   //       />
   //    ),
   // },
   {
      title: "Kontaktit",
      url: "/dashboard/contacts",
      icon: (isActive) => (
         <BookUser
            className={cn("mr-1", isActive && "text-indigo-500")}
         />
      ),
   },
   {
      title: "Suosikkini",
      url: "/dashboard/networks",
      icon: (isActive) => (
         <Network
            className={cn("mr-1", isActive && "text-indigo-500")}
         />
      ),
   },
   {
      title: "Viikon haut",
      url: "/dashboard/week-searches",
      icon: (isActive) => (
         <CalendarSearch
            className={cn("mr-1", isActive && "text-indigo-500")}
         />
      ),
      sub_menu: true
   },
   {
      title: "Tapaamiset",
      url: "/dashboard/meetings",
      icon: (isActive) => (
         <Handshake
            className={cn("mr-1", isActive && "text-indigo-500")}
         />
      )
   },
];

export function AppSidebar() {
   const { open } = useSidebar();

   const pathname = usePathname();

   return (
      <Sidebar collapsible="icon">
         <SidebarContent>
            <SidebarGroup className="py-0">
               <SidebarGroupLabel className="justify-center h-16 py-2 flex-0">
                  <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
                     Net<span className="text-blue-500">Connect</span>
                  </h1>
               </SidebarGroupLabel>
               <Separator />
               <SidebarGroupContent>
                  <SidebarMenu className="py-2">
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                           <Link href={"/dashboard"} className={cn("!w-full !text-base hover:bg-indigo-50 font-medium !h-10 shadow-smshadow-indigo-50", pathname === "/dashboard" && "bg-indigo-100 !font-semibold hover:bg-indigo-100")}>
                              <Home className={cn("mr-1", pathname === "/dashboard" && "text-indigo-500")} />
                              {open && <span>Koti</span>}
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                     {
                        items.map((item) => {
                           const isActive = pathname === item.url;

                           if (item?.sub_menu) return (
                              <Accordion type="single" collapsible key={item.title}>
                                 <AccordionItem value={item.url} className="border-none">
                                    <AccordionTrigger iconHidden={!open} className="!text-base w-full p-2 font-medium !h-10 shadow-sm shadow-indigo-50 hover:no-underline hover:bg-sidebar-accent">
                                       <div className="flex gap-2 items-center">
                                          <CalendarSearch className={cn("mr-1 shrink-0")} />
                                          {open && <span className={!open ? "w-1" : "w-auto"}>Viikon haut</span>}
                                       </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="!border-none !border-0 p-0 !shadow-none !outline-none">
                                       <SidebarMenuSub>
                                          <SidebarMenuSubItem>
                                             <SidebarMenuSubButton asChild>
                                                <Link href={"/dashboard/week-searches/my"} className={cn(" hover:bg-indigo-50 font-medium !h-9 shadow-sm shadow-indigo-50", pathname.includes("/dashboard/week-searches/my") && "bg-indigo-50 !font-semibold")}>
                                                   <Plus size={16} strokeWidth={2} className='text-indigo-500' />
                                                </Link>
                                             </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                          <SidebarMenuSubItem>
                                             <SidebarMenuSubButton asChild>
                                                <Link href={"/dashboard/week-searches"} className={cn(" hover:bg-indigo-50 font-medium !h-9 shadow-sms hadow-indigo-50", !pathname.includes("/dashboard/week-searches/my") && pathname.includes("/dashboard/week-searches") && "bg-indigo-50 !font-semibold ")}>
                                                   Kaikki
                                                </Link>
                                             </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                       </SidebarMenuSub>
                                    </AccordionContent>
                                 </AccordionItem>
                              </Accordion>
                           )
                           else return (
                              <SidebarMenuItem key={item.title}>
                                 <SidebarMenuButton asChild>
                                    <Link href={item.url} className={cn("!text-base hover:bg-indigo-50 font-medium !h-10", pathname.includes(item.url) && "bg-indigo-100 !font-semibold hover:bg-indigo-100")}>
                                       {item.icon(isActive)}
                                       {open && <span>{item.title}</span>}
                                    </Link>
                                 </SidebarMenuButton>
                              </SidebarMenuItem>
                           )

                        })
                     }
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}

