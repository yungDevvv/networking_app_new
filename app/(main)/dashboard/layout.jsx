import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/header"
import { ModalProvider } from "@/components/providers/modal-provider"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { UserProvider } from "@/context/user-context";
import { getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite";
import { cookies } from 'next/headers';
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardLayout({ children }) {
   const user = await getLoggedInUserProfile();
   const messages = await getMessages();
   const cookieStore = await cookies()
   const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

   return (
      <UserProvider user={user}>
         <NextIntlClientProvider messages={messages}>
            <SidebarProvider defaultOpen={defaultOpen}>
               <AppSidebar />
               <main className="w-full min-h-screen px-5 max-md:px-3">
                  <Header />
                  {children}
               </main>
               <ModalProvider />
               <Toaster />
            </SidebarProvider>
         </NextIntlClientProvider>
      </UserProvider>


   )
}