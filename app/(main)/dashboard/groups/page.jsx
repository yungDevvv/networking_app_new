"use client"

import { Button } from "@/components/ui/button";
import { CircleArrowRight, SquarePlus, Users2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import GroupPageSearch from "./search";
import { useMemo, useState } from "react";
import { useUser } from "@/context/user-context";

export default function Page() {
   console.log("groups page");

   const t = useTranslations();
   const { onOpen } = useModal();
   const [searchTerm, setSearchTerm] = useState("");
   const user = useUser();

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const groupsWhereCurrentUserIsMember = user?.group_members
      ? user.group_members
         .filter(membership => membership.groups)
         .map(membership => membership.groups)
      : [];

   // const filteredGroups = useMemo(() => groupsWhereCurrentUserIsMember?.filter(group => {
   //    if (!searchTerm) return true;

   //    const searchLower = searchTerm.toLowerCase();
   //    const searchableFields = [
   //       group.name,
   //       group.description,
   //    ].filter(Boolean);

   //    return searchableFields.some(field =>
   //       String(field).toLowerCase().includes(searchLower)
   //    );
   // }), [searchTerm]);
   
   const filteredGroups = groupsWhereCurrentUserIsMember?.filter(group => {
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
      <div className="space-y-8 max-xs:space-y-4">
         {/* Header section */}
         <div className="flex justify-between items-center max-xs:flex-col max-xs:justify-start max-xs:items-start max-xs:gap-4">
            <div>
               <h1 className="text-2xl font-semibold max-md:text-xl">{t("my_groups")}</h1>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 !mt-0 max-xs:w-full" onClick={() => onOpen("create-group-modal")}>
               <Plus className="h-4 w-4" />

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
         {groupsWhereCurrentUserIsMember && groupsWhereCurrentUserIsMember.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
               <Users2 className="mx-auto h-12 w-12 text-gray-400" />
               <h3 className="mt-2 text-sm font-semibold text-gray-900">{t("no_groups")}</h3>
               <p className="mt-1 text-sm text-gray-500">{t("start_by_creating_group")}</p>
               <div className="mt-6">
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onOpen("create-group-modal")}>
                     <SquarePlus className="mr-2 h-5 w-5" />
                     {t("create_group")}
                  </Button>
               </div>
            </div>
         ) : (
            <>
               {filteredGroups && filteredGroups.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-gray-500">{t("no_groups_found")}</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {filteredGroups?.length && filteredGroups.map((group) => (
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
                                 <p className="text-sm text-gray-500">
                                    {user.groups.find((n) => n.$id === group.$id)?.group_members?.length}{" "}
                                    {t("members")}
                                 </p>
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
