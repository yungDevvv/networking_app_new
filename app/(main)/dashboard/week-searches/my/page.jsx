"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import UserDuplicateWeekSearch from "@/components/week-search/user-duplicate-week-search"
import UserWeekSearchItem from "@/components/week-search/user-week-search-item"
import { Loader2, Search, Send, Tag } from "lucide-react"
import { createDocument, getLoggedInUser } from "@/lib/appwrite/server/appwrite"
import { useDocuments } from "@/hooks/use-documents"
import { businessCategories } from "@/types/business-categories"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export default function My() {
   const t = useTranslations();
   const router = useRouter();

   const [activeCaterogies, setActiveCategories] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [duplicatedWeekSearch, setDuplicatedWeekSearch] = useState(null);
   const [text, setText] = useState("");

   const { documents: week_searches, isLoading: contentIsLoading, mutate } = useDocuments(
      "main_db",
      "week_searches",
      useMemo(() => [], [])
   );

   const handleDuplicateWeekSearch = async (text, prevWeekSearch) => {
      try {
         const user = await getLoggedInUser();

         await createDocument("main_db", "week_searches", {
            body: {
               text,
               categories: prevWeekSearch.categories || [],
               profiles: user.$id
            }
         });
         mutate();
         router.refresh();
      } catch (error) {
         console.log(error);
      }
   };

   const handleCreateWeekSearch = useCallback(async () => {
      if (!text.trim()) return;

      setIsLoading(true);

      try {
         const user = await getLoggedInUser();
         await createDocument("main_db", "week_searches", {
            body: {
               text,
               categories: activeCaterogies,
               profiles: user.$id
            }
         });

         setText("");
         setActiveCategories([]);
         mutate();
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
      }
   }, [text, activeCaterogies, mutate]);

   const toggleCategory = useCallback((category) => {
      setActiveCategories((prev) =>
         prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]
      );
   }, []);

   return (
      <div className="max-w-[660px] mx-auto pb-10">
         <div className="space-y-4">
            <div className="py-5">
               <h1 className="text-xl font-semibold">{t("weekly_searches")}</h1>
               <p className="text-sm text-gray-500 mt-1">
                  {t("asd101")}
               </p>

               <div className="mt-4 space-y-4">
                  <Textarea
                     onChange={(e) => setText(e.target.value)}
                     value={text}
                     placeholder={t("asd102")}
                     className="min-h-[120px] resize-none"
                  />
                  <div className="space-y-2">
                     {businessCategories.map((category) => (
                        <div
                           key={category}
                           onClick={() => toggleCategory(category)}
                           className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mr-2 cursor-pointer",
                              activeCaterogies.includes(category)
                                 ? "bg-indigo-50 text-indigo-700"
                                 : "bg-gray-50 text-gray-700"
                           )}
                        >
                           <Tag className="h-3.5 w-3.5" />
                           <span>{t(category)}</span>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-end">
                     <Button
                        disabled={!text.trim()}
                        onClick={handleCreateWeekSearch}
                     >
                        {isLoading ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <>
                              <Send className="h-4 w-4 mr-2" />
                              {t("send")}
                           </>
                        )}
                     </Button>
                  </div>
               </div>

            </div>

            {duplicatedWeekSearch && (
               <UserDuplicateWeekSearch weekSearch={duplicatedWeekSearch} t={t} setDuplicatedWeekSearch={setDuplicatedWeekSearch} handleDuplicateWeekSearch={handleDuplicateWeekSearch} />
            )}

            {contentIsLoading ? (
               <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
               </div>
            ) : week_searches?.length > 0 ? (
               <div className="space-y-4">
                  {week_searches.map((weekSearch) => (
                     <UserWeekSearchItem
                        key={weekSearch.$id}
                        weekSearch={weekSearch}
                        setDuplicatedWeekSearch={setDuplicatedWeekSearch}
                        mutate={mutate}
                        router={router}
                     />
                  ))}
               </div>
            ) : (
               <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">{t("no_week_searches")}</h3>
                  <p className="text-sm text-gray-500">{t("asd22")}</p>
               </div>
            )}
         </div>
      </div>
   );
}
