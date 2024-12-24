"use client"

import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import React from "react"
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";

export default function LanguageSwitcher({ className, locale }) {
   const router = useRouter();
   const currentLocale = useLocale();

   const changeLanguage = async (locale) => {
      document.cookie = `locale=${locale}; path=/`;
      router.refresh();
   };

   return (
      <React.Fragment>
         <div className={className}>
            <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-2 border border-white rounded-md p-2 uppercase select-none [&[data-state=open]>svg]:rotate-180 hover:bg-sidebar-accent transition-colors">
                  {/* <Button variant="outline" className="flex items-center gap-2"> */}
                  <GlobeIcon className="h-5 w-5 text-indigo-500" />
                  <span>
                     {currentLocale} 
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                  {/* </Button> */}
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[90px]">
                  <DropdownMenuItem onClick={() => changeLanguage("fi")} className="flex items-center justify-between cursor-pointer">
                     <span>Suomi</span>
                     {currentLocale === "fi" && <CheckIcon className="h-5 w-5 " />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("en")} className="flex items-center justify-between cursor-pointer">
                     <span>English</span>
                     {currentLocale === "en" && <CheckIcon className="h-5 w-5 " />}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </React.Fragment>
   )
}