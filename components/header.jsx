import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, UserRound } from "lucide-react"


const Header = () => {
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
                     <strong className="text-sm font-medium leading-none">Semen M.</strong>
                     <p className="text-xs text-zinc-600 -mt-1">contact@bundui.io</p>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                  <UserRound />
                  <span>Profile</span>
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <LogOut />
                  <span>Kirjaudu ulos</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>


      </header>
   )
}

export default Header;