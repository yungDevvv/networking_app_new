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
import { LogOut, UserRound } from "lucide-react"
import { getLoggedInUser } from "@/lib/appwrite/server/appwrite"
import { Button } from "./ui/button"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function signOut() {
   "use server";

   const { account } = await createSessionClient();

   cookies().delete("my-custom-session");
   await account.deleteSession("current");

   redirect("/login");
}

const Header = async () => {
   const user = await getLoggedInUser();

   if (!user) return null;

   return (
      <header className="w-full flex justify-between items-center min-h-16">
         <SidebarTrigger />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Avatar className="cursor-pointer select-none">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>S</AvatarFallback>
               </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={7}>
               <DropdownMenuLabel className="flex items-center justify-between">
                  <Avatar className="w-8 h-8 select-none">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                     <strong className="text-sm font-medium leading-none">{user.name} Semen M.</strong>
                     <p className="text-xs text-zinc-600 -mt-1">{user.email}</p>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="cursor-pointer">
                  <UserRound />
                  <span>Profile</span>
               </DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer">
                  <form action={signOut}>
                     <button type="submit" className="flex items-center space-x-2">
                        <LogOut />
                        <span>Kirjaudu ulos</span>
                     </button>
                  </form>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </header>
   )
}

export default Header;