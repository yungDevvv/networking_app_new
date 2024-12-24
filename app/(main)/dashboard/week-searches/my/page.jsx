"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import UserDuplicateWeekSearch from "@/components/week-search/user-duplicate-week-search"
import UserWeekSearchItem from "@/components/week-search/user-week-search-item"
import { Loader2, Search, Send } from "lucide-react"
import { createDocument, getLoggedInUser } from "@/lib/appwrite/server/appwrite"
import { useDocuments } from "@/hooks/use-documents"

export default function My() {
   const [isLoading, setIsLoading] = useState(false);
   const [confirmStatus, setConfirmStatus] = useState(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
   const [duplicatedWeekSearch, setDuplicatedWeekSearch] = useState(null);
   const [text, setText] = useState("");
   const [weekSearches, setWeekSearches] = useState([]);
   const router = useRouter()

   const { documents: week_searches, isLoading: contentIsLoading, isError, mutate } = useDocuments("main_db", "week_searches");

   const handleCreateWeekSearch = async () => {
      const user = await getLoggedInUser();

      setIsLoading(true);
      try {
         await createDocument("main_db", "week_searches", {
            body: {
               text,
               profiles: user.$id
            }
         });

         mutate();
         router.refresh();
      } catch (error) {
         console.error(error);
      } finally {
         setText("");
         setIsLoading(false);
      }
   };



   return (
      <div className="max-w-[850px] mx-auto space-y-6 py-5">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-2">
               <h2 className="text-lg font-semibold text-gray-900">Create Weekly Search Request</h2>
               <p className="text-sm text-gray-500">
                  Define who or what you're looking for. Your request will be visible to other users for a week.
               </p>
            </div>
            <div className="mt-4 space-y-4">
               <Textarea
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  placeholder="Example: Looking for marketing decision-makers at company XXX Oy."
                  className="min-h-[120px] resize-none"
               />
               <Button
                  className="w-full sm:w-auto"
                  disabled={!text.trim()}
                  onClick={() => handleCreateWeekSearch()}
               >
                  <Send className="w-4 h-4 mr-2" />
                  Send
               </Button>
            </div>
         </div>

         {duplicatedWeekSearch && <UserDuplicateWeekSearch weekSearch={duplicatedWeekSearch} />}

         <div className="space-y-4">
            {contentIsLoading && <div className="w-full flex justify-center"><Loader2 size={30} className="mr-2 animate-spin text-indigo-500" /></div>}
            {!contentIsLoading && week_searches && week_searches.length > 0 && (
               week_searches.map(weekSearch => (
                  <UserWeekSearchItem
                     key={weekSearch.$id}
                     weekSearch={weekSearch}
                     setDuplicatedWeekSearch={setDuplicatedWeekSearch}
                     router={router}
                     mutate={mutate}
                  />
               ))
            )}
            {!contentIsLoading && week_searches && week_searches.length === 0 && (
               <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                     <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No search requests yet</h3>
                  <p className="text-sm text-gray-500">Create your first weekly search request above.</p>
               </div>
            )}
           
         </div>
      </div>
   )
}
