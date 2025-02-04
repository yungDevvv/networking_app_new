import { Clock, Loader2, MapPin, MessageSquare, Send, Tag } from "lucide-react";
import { Fragment, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import WeekSearchComment from "./week-search-comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { storage } from "@/lib/appwrite/client/appwrite";
import { createDocument, getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite";
import { useLocale, useTranslations } from "next-intl";

const WeekSearchItem = ({ weekSearch, router, mutate }) => {
   const [commentsOpen, setCommentsOpen] = useState(false);
   const [commentText, setCommentText] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [visibleComments, setVisibleComments] = useState(5);

   const t = useTranslations();
   const locale = useLocale();

   const handleCommentSubmit = async () => {
      if (!commentText.trim()) return;

      setIsLoading(true);

      const user = await getLoggedInUserProfile();

      try {
         const res = await createDocument("main_db", "week_search_comments", {
            body: {
               text: commentText,
               profiles: user.$id,
               week_searches: weekSearch.$id
            }
         });

         mutate();
         router.refresh();
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
         setCommentText("");
      }
   };

   const loadMoreComments = () => {
      setVisibleComments(prev => prev + 5);
   };

   const displayedComments = weekSearch.week_search_comments.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).slice(0, visibleComments);
   const hasMoreComments = weekSearch.week_search_comments.length > visibleComments;

   return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 transition-all max-w-[660px] max-xl:w-full">
         <div className="p-4 max-xl:p-3">
            {/* Header */}
            <div className="flex items-start gap-4">
               <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", weekSearch.profiles.avatar)} />
                  <AvatarFallback>
                     <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                  </AvatarFallback>
               </Avatar>

               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="font-semibold text-gray-900">{weekSearch.profiles.name}</h3>
                     <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                           <MapPin className="h-3.5 w-3.5" />
                           <span>{weekSearch.profiles.location}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-1">
                           <Clock className="h-3.5 w-3.5" />
                           <span>{formatDateTime(weekSearch.$createdAt, locale)}</span>
                        </div>
                     </div>
                  </div>
                  <div className="mb-4">
                     <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {weekSearch.categories.length !== 0 && weekSearch.categories.map((category) => (
                           <div key={category} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                              <Tag className="h-3.5 w-3.5" />
                              <span>{t(category)}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
                     {weekSearch.text}
                  </p>
               </div>
            </div>




            <Separator className="my-4 max-xl:my-3" />

            {/* Actions */}
            <div className="flex items-center gap-2">
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 max-xl:h-8 hover:text-gray-700"
                  onClick={() => setCommentsOpen(!commentsOpen)}
               >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  <span>
                     {weekSearch.week_search_comments?.length ? weekSearch.week_search_comments?.length : ''}
                  </span>
               </Button>
            </div>
         </div>

         {/* Comments Section */}
         {commentsOpen && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 max-xl:p-3 space-y-4 max-xl:space-y-3 rounded-b-xl">
               <div className="max-w-full space-y-4">
                  {weekSearch?.week_search_comments && weekSearch.week_search_comments.length !== 0 ? (
                     <>
                        <div className="space-y-3">
                           {displayedComments.map((comment) => (
                              <div key={comment.$id} className="max-w-full">
                                 <WeekSearchComment comment={comment} />
                              </div>
                           ))}
                        </div>
                        {hasMoreComments && (
                           <button
                              onClick={loadMoreComments}
                              className="w-full mt-4 py-2 px-4 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                           >
                              {t('load_more_comments')}
                           </button>
                        )}
                     </>
                  ) : (
                     <div className="text-sm text-gray-500">{t("no_comments_found")}</div>
                  )}
               </div>

               <div className="space-y-3 !mt-10">
                  <Textarea
                     placeholder={t("write_comment")}
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     className="resize-none w-full !mt-0"
                  />
                  <div className="flex justify-end">
                     <Button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim()}
                        className="w-24"
                     >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                     </Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default WeekSearchItem;