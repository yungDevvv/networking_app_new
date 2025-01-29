"use client"

import { Button } from "@/components/ui/button";
import { Users2, Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import { useUpdateUser, useUser } from "@/context/user-context";
import { useState } from "react";
import { addToFavorites } from "@/lib/appwrite/server/appwrite";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
   const t = useTranslations();
   const user = useUser();
   const { toast } = useToast();
   const updateUser = useUpdateUser();

   const favoriteNetworks = user?.favorite_networks || [];
   const favoriteGroups = user?.favorite_groups || [];

   const handleRemoveFavorite = async (type, item_id) => {
      try {
         await addToFavorites(type, item_id);
         await updateUser();
         
         toast({
            variant: "success",
            title: "Suosikki",
            description: type === "networks" 
               ? "Verkosto on poistettu suosikeista."
               : "Ryhmä on poistettu suosikeista."
         });
      } catch (error) {
         console.log(error);
         toast({
            variant: "destructive",
            description: "Tuntematon virhe."
         });
      }
   };

   const NetworkCard = ({ network }) => (
      <div key={network.$id} className="group relative rounded-lg border p-6 hover:shadow-md transition-all">
         <div 
            className="absolute top-3 right-3 z-20 cursor-pointer" 
            title="Poista suosikeista"
            onClick={() => handleRemoveFavorite("networks", network.$id)}
         >
            <Star className="h-5 w-5 text-indigo-400 fill-indigo-400 hover:text-indigo-500" />
         </div>
         <Link href={`/dashboard/networks/${network.$id}`}>
            <div className="flex items-center space-x-3">
               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users2 className="h-6 w-6 text-indigo-600" />
               </div>
               <div className="flex-1 truncate">
                  <h3 className="font-medium text-gray-900 truncate">{network.name}</h3>
                  <p className="text-sm text-gray-500">{network.members?.length || 0} {t("members")}</p>
               </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 line-clamp-3">{network.description}</p>
            <span className="absolute inset-0" />
         </Link>
      </div>
   );

   const GroupCard = ({ group }) => (
      <div key={group.$id} className="group relative rounded-lg border p-6 hover:shadow-md transition-all">
         <div 
            className="absolute top-3 right-3 z-20 cursor-pointer" 
            title="Poista suosikeista"
            onClick={() => handleRemoveFavorite("groups", group.$id)}
         >
            <Star className="h-5 w-5 text-indigo-400 fill-indigo-400 hover:text-indigo-500" />
         </div>
         <Link href={`/dashboard/groups/${group.$id}`}>
            <div className="flex items-center space-x-3">
               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users2 className="h-6 w-6 text-indigo-600" />
               </div>
               <div className="flex-1 truncate">
                  <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members?.length || 0} {t("members")}</p>
               </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 line-clamp-3">{group.description}</p>
            <span className="absolute inset-0" />
         </Link>
      </div>
   );

   const NoFavorites = ({ type }) => (
      <div className="text-center py-8 px-4 rounded-lg border border-dashed">
         <Search className="mx-auto h-8 w-8 text-gray-400" />
         <p className="mt-3 text-sm text-gray-500">
            {type === "networks" 
               ? t("no_favorite_networks") 
               : t("no_favorite_groups")
            }
         </p>
      </div>
   );

   return (
      <div className="space-y-8 max-md:space-y-5 max-xs:space-y-3">
         <h1 className="text-2xl font-semibold max-md:text-xl">{t("navbar_favorites")}</h1>

         <div className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-lg font-medium">{t("navbar_mynetworks")}</h2>
               {favoriteNetworks.length === 0 ? (
                  <NoFavorites type="networks" />
               ) : (
                  <div className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-[970px]:grid-cols-1">
                     {favoriteNetworks.map(network => (
                        <NetworkCard key={network.$id} network={network} />
                     ))}
                  </div>
               )}
            </div>

            <div className="space-y-4">
               <h2 className="text-lg font-medium">{t("private_groups")}</h2>
               {favoriteGroups.length === 0 ? (
                  <NoFavorites type="groups" />
               ) : (
                  <div className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-[970px]:grid-cols-1">
                     {favoriteGroups.map(group => (
                        <GroupCard key={group.$id} group={group} />
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
