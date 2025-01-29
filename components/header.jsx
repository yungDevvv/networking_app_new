import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Bell, LogOut, Server, Settings, UserRound } from "lucide-react"
import { createSessionClient, getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite"
import { Button } from "./ui/button"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link"
import LanguageSwitcher from "./language-switcher"
import { storage } from "@/lib/appwrite/client/appwrite"
import { getTranslations } from "next-intl/server"

async function signOut() {
   "use server";

   const { account } = await createSessionClient();
   const cookieStore = await cookies();
   cookieStore.delete("my-custom-session");
   await account.deleteSession("current");

   redirect("/login");
}

const Header = async () => {
   const user = await getLoggedInUserProfile();

   const t = await getTranslations();

   if (!user) return null;

   return (
      <header className="w-full flex justify-between items-center min-h-16 border-b border-black/10 mb-4">
         <SidebarTrigger />
         <div className="flex items-center">
            <LanguageSwitcher className="mr-4" />
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer select-none">
                     <AvatarImage className="object-cover" src={`${storage.getFilePreview("avatars", user.avatar)}`} />
                     <AvatarFallback>
                        <img src="/blank_profile.png" alt="avatar_fallback" />
                     </AvatarFallback>
                  </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent side="bottom" align="end" sideOffset={7}>
                  <DropdownMenuLabel className="flex items-center justify-between">
                     <Avatar className="w-8 h-8 select-none">
                        <AvatarImage src={`${storage.getFilePreview("avatars", user.avatar)}`} />
                        <AvatarFallback>
                           <img src="/blank_profile.png" alt="avatar_fallback" />
                        </AvatarFallback>
                     </Avatar>
                     <div className="ml-3">
                        <strong className="text-sm font-medium leading-none">{user.name}</strong>
                        <p className="text-xs font-normal text-zinc-600 -mt-1">{user.email}</p>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard/account/profile">
                     <DropdownMenuItem className="cursor-pointer">
                        <UserRound />
                        <span>{t("profile")}</span>
                     </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/account/settings">
                     <DropdownMenuItem className="cursor-pointer">
                        <Settings />
                        <span>{t("settings")}</span>
                     </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/account/notifications">
                     <DropdownMenuItem className="cursor-pointer">
                        <Bell />
                        <span>{t("notifs")}</span>
                     </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/account/invite">
                     <DropdownMenuItem className="cursor-pointer">
                        <Award />
                        <span>Kutsu käyttäjät</span>
                     </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer">
                     <form action={signOut}>
                        <button type="submit" className="flex items-center space-x-2">
                           <LogOut />
                           <span>{t("navbar_logout")}</span>
                        </button>
                     </form>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

      </header>
   )
}

export default Header;