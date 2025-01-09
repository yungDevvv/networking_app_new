"use client"

import { Button } from "@/components/ui/button";
import { CircleArrowRight, SquarePlus, Users2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import { useDocuments } from "@/hooks/use-documents";
import { useUser } from "@/context/user-context";
import NetworkPageSearch from "./search";
import { useState } from "react";

export default function Page() {
   const t = useTranslations();
   const { onOpen } = useModal();
   const user = useUser();
   const [searchTerm, setSearchTerm] = useState("");

   const networksWhereCurrentUserIsMember = user.members
      .filter(membership => membership.networks)
      .map(membership => membership.networks);

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const filteredNetworks = networksWhereCurrentUserIsMember?.filter(network => {
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



   return (
      <div className="space-y-8 max-md:space-y-5 max-xs:space-y-3">
         {/* Header section */}
         <div className="flex justify-between items-center flex-wrap">

            <h1 className="text-2xl font-semibold max-md:text-xl">{t("my_networks")}</h1>

            <Button className="bg-indigo-600 hover:bg-indigo-700 !mt-0 max-xs:w-full max-xs:!mt-3" onClick={() => onOpen("create-network-modal")}>
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
         {user && networksWhereCurrentUserIsMember.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
               <Users2 className="mx-auto h-12 w-12 text-gray-400" />
               <h3 className="mt-2 text-sm font-semibold text-gray-900">{t("no_networks")}</h3>
               <p className="mt-1 text-sm text-gray-500">{t("start_by_creating")}</p>
               <div className="mt-6">
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onOpen("create-network-modal")}>
                     <SquarePlus className="mr-2 h-5 w-5" />
                     {t("create_network")}
                  </Button>
               </div>
            </div>
         ) : (
            <>
               {filteredNetworks.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-gray-500">No networks found</p>
                  </div>
               ) : (
                  <div className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-[970px]:grid-cols-1">
                     {filteredNetworks.map((network) => (
                        <Link
                           key={network.$id}
                           href={`/dashboard/networks/${network.$id}`}
                           className="group relative rounded-lg border p-6 hover:border-indigo-500 transition-all"
                        >
                           <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                 <Users2 className="h-6 w-6 text-indigo-600" />
                              </div>
                              <div className="flex-1 truncate">
                                 <h3 className="font-medium text-gray-900 truncate">{network.name}</h3>
                                 <p className="text-sm text-gray-500">{user.networks.find((n) => n.$id === network.$id).members.length} {t("members")}</p>
                              </div>
                           </div>
                           <p className="mt-4 text-sm text-gray-500 line-clamp-3">{network.description}</p>
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
