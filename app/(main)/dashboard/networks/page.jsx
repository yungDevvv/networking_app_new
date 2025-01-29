"use client"

import { Button } from "@/components/ui/button";
import { CircleArrowRight, SquarePlus, Users2, Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import { useDocuments } from "@/hooks/use-documents";
import { useUser } from "@/context/user-context";
import NetworkPageSearch from "./search";
import { useState } from "react";
import { addToFavorites } from "@/lib/appwrite/server/appwrite";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
   const t = useTranslations();
   const { onOpen } = useModal();
   const user = useUser();
   const [searchTerm, setSearchTerm] = useState("");
   const { toast } = useToast();

   const { documents, isError, isLoading, mutate } = useDocuments("main_db", "networks");

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const filteredNetworks = documents?.filter(network => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
         network.name,
         network.description
      ].filter(Boolean);

      return searchableFields.some(field =>
         String(field).toLowerCase().includes(searchLower)
      );
   });

   const handleAddFavorite = async (item_id) => {
      try {
         const isAdded = await addToFavorites("networks", item_id);
         toast({
            variant: "success",
            title: t("favorite"),
            description: isAdded 
               ? t("network_added_to_favorites")
               : t("network_removed_from_favorites")
         });
         mutate();
      } catch (error) {
         console.log(error);
         toast({
            variant: "destructive",
            description: t("unknown_error")
         });
      }
   };

   const isFavorite = (networkId) => {
      return user?.favorite_networks?.find(network => network.$id === networkId) || false;
   };

   return (
      <div className="space-y-8 max-md:space-y-5 max-xs:space-y-3">
         {/* Header section */}
         <div className="flex justify-between items-center flex-wrap">

            <h1 className="text-2xl font-semibold max-md:text-xl">{t("my_networks")}</h1>

            <Button className="bg-indigo-600 hover:bg-indigo-700 !mt-0 max-xs:w-full max-xs:!mt-3" onClick={() => onOpen("create-network-modal", {mutate})}>
               <SquarePlus className="mr-1 h-5 w-5" />
               {t("create_network")}
            </Button>
         </div>

         {/* Search section */}
         <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
               <NetworkPageSearch onSearch={handleSearch} />
            </div>
         </div>

         {/* Networks grid */}
         {isLoading && <Loader2 className="mx-auto h-10 w-10 text-indigo-500 animate-spin" />}
         {isError && <p>{t("something_went_wrong")}</p>}
         {filteredNetworks && filteredNetworks?.length === 0 ? (
            <div className="text-center">
               <Search className="mx-auto h-8 w-8 text-indigo-500" />
               <p className="mt-3 text-sm text-gray-500">{t("no_networks_found")}</p>
            </div>
         ) : (
            <>
               {filteredNetworks && filteredNetworks?.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-gray-500">{t("no_networks_found")}</p>
                  </div>
               ) : (
                  <div className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-[970px]:grid-cols-1">
                     {filteredNetworks && filteredNetworks.map((network) => (
                        <div key={network.$id} className="group relative rounded-lg border p-6 hover:shadow-md transition-all">
                           <div 
                              className="absolute top-3 right-3 z-20 cursor-pointer" 
                              title={isFavorite(network.$id) ? t("remove_from_favorites") : t("add_to_favorites")} 
                              onClick={() => handleAddFavorite(network.$id)}
                           >
                              <Star className={`h-5 w-5 ${isFavorite(network.$id) ? "text-indigo-400 fill-indigo-400" : "text-gray-400"} hover:text-indigo-400`} />
                           </div>
                           <Link
                              href={`/dashboard/networks/${network.$id}`}
                           >
                              <div className="flex items-center space-x-3">
                                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Users2 className="h-6 w-6 text-indigo-600" />
                                 </div>
                                 <div className="flex-1 truncate">
                                    <h3 className="font-medium text-gray-900 truncate">{network.name}</h3>
                                    <p className="text-sm text-gray-500">{network.members.length} {t("members")}</p>
                                 </div>
                              </div>
                              <p className="mt-4 text-sm text-gray-500 line-clamp-3">{network.description}</p>
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
