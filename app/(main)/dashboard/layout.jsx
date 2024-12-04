"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/header"
import { ModalProvider } from "@/components/providers/modal-provider"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }) {
   const [count, setCounter] = useState(0)


   return (
      <SidebarProvider>
         <AppSidebar />
         <main className="w-full min-h-screen px-5">
            <Header />
            {children}
         </main>
         <ModalProvider />
      </SidebarProvider>
   )
}