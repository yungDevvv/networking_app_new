"use client"

import { Button } from "@/components/ui/button";
import { CircleArrowRight, SquarePlus, Users2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import { useDocuments } from "@/hooks/use-documents";
import GroupPageSearch from "./search";
import { useState } from "react";

export default function Page() {
   const t = useTranslations();
   const { onOpen } = useModal();
   const [searchTerm, setSearchTerm] = useState("");

   const { documents: groups, isLoading, isError, mutate } = useDocuments("main_db", "groups");

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const filteredGroups = groups?.filter(group => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
         group.name,
         group.description,
      ].filter(Boolean);

      return searchableFields.some(field =>
         String(field).toLowerCase().includes(searchLower)
      );
   });

   return (
      <div className="space-y-8">
         {/* Header section */}
         <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
               <h1 className="text-2xl font-semibold">{t("my_groups")}</h1>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 !mt-0" onClick={() => onOpen("create-group-modal", { mutate: mutate })}>
               <SquarePlus className="mr-2 h-5 w-5" />
               {t("create_group")}
            </Button>
         </div>

         {/* Search section */}
         <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
               <GroupPageSearch onSearch={handleSearch} />
            </div>
         </div>

         {/* Groups grid */}
         {groups && groups.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
               <Users2 className="mx-auto h-12 w-12 text-gray-400" />
               <h3 className="mt-2 text-sm font-semibold text-gray-900">{t("no_groups")}</h3>
               <p className="mt-1 text-sm text-gray-500">{t("start_by_creating_group")}</p>
               <div className="mt-6">
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onOpen("create-group-modal", { mutate: mutate })}>
                     <SquarePlus className="mr-2 h-5 w-5" />
                     {t("create_group")}
                  </Button>
               </div>
            </div>
         ) : (
            <>
               {isLoading ? (
                  <div className="flex items-center justify-center w-full">
                     <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
                  </div>
               ) : filteredGroups && filteredGroups.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-gray-500">{t("no_groups_found")}</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {filteredGroups.map((group) => (
                        <Link
                           key={group.$id}
                           href={`/dashboard/groups/${group.$id}`}
                           className="group relative rounded-lg border p-6 hover:border-indigo-500 transition-all"
                        >
                           <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                 <Users2 className="h-6 w-6 text-indigo-600" />
                              </div>
                              <div className="flex-1 truncate">
                                 <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                                 <p className="text-sm text-gray-500">{group.group_members.length} {t("members")}</p>
                              </div>
                           </div>
                           <p className="mt-4 text-sm text-gray-500 line-clamp-2">{group.description}</p>
                           <span className="absolute inset-0" />
                        </Link>
                     ))}
                  </div>
               )}
            </>
         )}
      </div>
   );
}
