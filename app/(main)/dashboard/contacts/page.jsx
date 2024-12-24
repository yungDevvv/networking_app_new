"use client";

import ContactCard from "@/components/contact-card";
import { listDocuments } from "@/lib/appwrite/server/appwrite";
import ContactPageSearch from "./search";
import { useDocuments } from "@/hooks/use-documents";
import { useUser } from "@/context/user-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Page() {
   const user = useUser();
   const { documents, isLoading } = useDocuments("main_db", "profiles");
   const [searchTerm, setSearchTerm] = useState("");
   const t = useTranslations();

   const handleSearch = (value) => {
      setSearchTerm(value);
   };

   const filteredUsers = documents?.filter(doc => {
      if (doc.$id === user.$id) return false;
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
         doc.name,
         doc.email,
         doc.location,
         doc.job_title,
         doc.introduction,
         doc.searching,
         doc.offering,
         doc.companies?.name
      ].filter(Boolean);

      return searchableFields.some(field =>
         String(field).toLowerCase().includes(searchLower)
      );
   });

   return (
      <div className="w-full">
         <div className="flex justify-between max-md:flex-wrap max-md:space-y-3">
            <h1 className="text-2xl max-md:text-xl font-semibold">{t("contacts")}</h1>
            <ContactPageSearch onSearch={handleSearch} />
         </div>
         <div className="mx-auto py-5">
            {isLoading && (
               <div className="w-full flex items-center justify-center">
                  <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
               </div>
            )}
            {!isLoading && (!filteredUsers || filteredUsers.length === 0) && (
               <div className="w-full flex items-center justify-center">
                  <h3>{t("no_users_found")}</h3>
               </div>
            )}
            <div className="grid grid-cols-3 max-2xl:grid-cols-2 max-[1100px]:grid-cols-1 gap-3">
               {filteredUsers && filteredUsers.length > 0 &&
                  filteredUsers.map((member, i) => (
                     <ContactCard
                        key={member.$id}
                        member={member}
                        meets={member.meets?.filter(meet => meet.sender_id === user.$id) || []}
                     />
                  ))
               }
               {documents && documents.length > 0 && (
                  <>
                     <ContactCard
                        key={documents[0].$id + 2}
                        member={documents[0]}
                        meets={documents[0].meets?.filter(meet => meet.sender_id === user.$id) || []}
                     />
                     <ContactCard
                        key={documents[0].$id + 3}
                        member={documents[0]}
                        meets={documents[0].meets?.filter(meet => meet.sender_id === user.$id) || []}
                     />
                     <ContactCard
                        key={documents[0].$id + 5}
                        member={documents[0]}
                        meets={documents[0].meets?.filter(meet => meet.sender_id === user.$id) || []}
                     />
                  </>
               )}

            </div>
         </div>
      </div>
   );
}