"use client"

import { Button } from "@/components/ui/button";
import { CircleArrowRight, SquarePlus, Users2, Loader2, Search, Star, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import GroupPageSearch from "./search";
import { useState } from "react";
import { useUpdateUser, useUser } from "@/context/user-context";
import { addToFavorites } from "@/lib/appwrite/server/appwrite";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Page() {
   const t = useTranslations();
   const { onOpen } = useModal();
   const [searchTerm, setSearchTerm] = useState("");
   const user = useUser();
   const { toast } = useToast();

   const updateUser = useUpdateUser();

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const groupsWhereCurrentUserIsMember = user?.group_members
      ? user.group_members
         .filter(membership => membership.groups)
         .map(membership => membership.groups)
      : [];

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

   const handleAddFavorite = async (item_id) => {
      try {
         const isAdded = await addToFavorites("groups", item_id);
         toast({
            variant: "success",
            title: "Suosikki",
            description: isAdded 
               ? "Ryhmä on lisätty suosikkiin."
               : "Ryhmä on poistettu suosikeista."
         });

         await updateUser()
      } catch (error) {
         console.log(error);
         toast({
            variant: "destructive",
            description: "Tuntematon virhe."
         });
      }
   };

   const isFavorite = (groupId) => {
      return user?.favorite_groups?.find(group => group.$id === groupId) || false;
   };

   return (
      <div className="space-y-8 max-md:space-y-5 max-xs:space-y-3">
         {/* Header section */}
         <div className="flex justify-between items-center flex-wrap">
            <h1 className="text-2xl font-semibold max-md:text-xl">{t("my_groups")}</h1>

            <Button className="bg-indigo-600 hover:bg-indigo-700 !mt-0 max-xs:w-full max-xs:!mt-3" onClick={() => onOpen("create-group-modal")}>
               <Plus className="mr-1 h-5 w-5" />
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
            <div className="text-center">
               <Search className="mx-auto h-8 w-8 text-indigo-500" />
               <p className="mt-3 text-sm text-gray-500">{t("no_groups_found")}</p>
            </div>
         ) : (
            <>
               {filteredGroups && filteredGroups.length === 0 ? (
                  <div className="text-center">
                     <Search className="mx-auto h-8 w-8 text-indigo-500" />
                     <p className="mt-3 text-sm text-gray-500">{t("no_groups_found")}</p>
                  </div>
               ) : (
                  <div className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-[970px]:grid-cols-1">
                     {filteredGroups?.map((group) => (
                        <div key={group.$id} className="group relative rounded-lg border p-6 hover:shadow-md transition-all">
                           <div 
                              className="absolute top-3 right-3 z-20 cursor-pointer" 
                              title={isFavorite(group.$id) ? "Poista suosikeista" : "Lisää suosikkiin"} 
                              onClick={() => handleAddFavorite(group.$id)}
                           >
                              <Star className={`h-5 w-5 ${isFavorite(group.$id) ? "text-indigo-400 fill-indigo-400" : "text-gray-400"} hover:text-indigo-400`} />
                           </div>
                           <Link href={`/dashboard/groups/${group.$id}`}>
                              <div className="flex items-center space-x-3">
                                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Users2 className="h-6 w-6 text-indigo-600" />
                                 </div>
                                 <div className="flex-1 truncate">
                                    <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                                    {/* <p className="text-sm text-gray-500">{group.members?.length || 0} {t("members")}</p> */}
                                 </div>
                              </div>
                              <p className="mt-4 text-sm text-gray-500 line-clamp-3">{group.description}</p>
                              <span className="absolute inset-0" />
                           </Link>
                        </div>
                     ))}
                  </div>
               )}
            </>
         )}
      </div>
   );
}
