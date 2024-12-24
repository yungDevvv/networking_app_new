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
   GlobeLock,
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
import { useTranslations } from "next-intl";

export function AppSidebar() {
   const { open, isMobile, openMobile } = useSidebar();
   console.log(isMobile)
   const t = useTranslations();

   const pathname = usePathname();

   const items = [
      {
         title: t("contacts"),
         url: "/dashboard/contacts",
         icon: (isActive) => (
            <BookUser
               className={cn("mr-1", isActive && "text-indigo-500")}
            />
         ),
      },
      {
         title: t("navbar_mynetworks"),
         url: "/dashboard/networks",
         icon: (isActive) => (
            <Network
               className={cn("mr-1", isActive && "text-indigo-500")}
            />
         ),
      },
      {
         title: t("navbar_week_search"),
         url: "/dashboard/week-searches",
         icon: (isActive) => (
            <CalendarSearch
               className={cn("mr-1", isActive && "text-indigo-500")}
            />
         ),
         sub_menu: true
      },
      {
         title: t("meetings"),
         url: "/dashboard/meetings",
         icon: (isActive) => (
            <Handshake
               className={cn("mr-1", isActive && "text-indigo-500")}
            />
         )
      },
      {
         title: t("private_groups"),
         url: "/dashboard/groups",
         icon: (isActive) => (
            <GlobeLock
               className={cn("mr-1", isActive && "text-indigo-500")}
            />
         )
      },
   ];
   return (
      <Sidebar collapsible="icon">
         <SidebarContent>
            <SidebarGroup className="py-0">
               {/* <div className="flex items-centerjustify-center h-16 py-2">
                  {open && open
                     ? (
                        <h1 className="text-2xl inline-block font-bold text-gray-800 tracking-wide">
                           <span>My</span>
                           <span className="text-blue-500"> Network</span>
                        </h1>
                     )
                     : (
                        <h1 className="text-sm font-bold inline-block text-gray-800 tracking-wide">
                           <span className="text-blue-500"> Network</span>
                        </h1>
                     )
                  }

               </div> */}
               <div className="flex items-center justify-center h-16 py-2 user-select-none">
                  <h1 className={cn("text-2xl font-bold flex justify-center w-full text-gray-800 tracking-wide transition-opacity opacity-1", !open && "opacity-0 hidden")}>
                     <span>My</span>
                     <span className="text-blue-500 ml-1"> Network</span>
                  </h1>
                  <h1 className={cn("font-bold text-2xl w-full transition-opacity flex justify-center opacity-1", open && "opacity-0 hidden")}>
                     <span className="w-fit text-blue-500">N</span>
                  </h1>
               </div>
               <Separator />
               <SidebarGroupContent>
                  <SidebarMenu className="py-2">
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                           <Link href={"/dashboard"} className={cn("!w-full !text-base hover:bg-indigo-50 font-medium !h-10 shadow-smshadow-indigo-50", pathname === "/dashboard" && "bg-indigo-100 !font-semibold hover:bg-indigo-100")}>
                              <Home className={cn("mr-1", pathname === "/dashboard" && "text-indigo-500")} />
                              {open && <span>{t("home")}</span>}
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
                                       {(open || openMobile) && <span>{item.title}</span>}
                                       {console.log(open, "OPEN")}
                                       {console.log(openMobile, "OPEN MOBILE")}
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

