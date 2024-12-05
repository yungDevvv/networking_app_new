import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/header"
import { ModalProvider } from "@/components/providers/modal-provider"

export default async function DashboardLayout({ children }) {
   
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