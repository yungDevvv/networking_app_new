"use client"

import { Clock, Copy, Pencil, MessageSquare, MoreVertical, ShieldCheck, Trash, Send, Loader2, Tag } from "lucide-react";
import { Fragment, useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import WeekSearchComment from "./week-search-comment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createDocument, deleteDocument, getLoggedInUser, updateDocument } from "@/lib/appwrite/server/appwrite";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/hooks/use-modal";

const UserWeekSearchItem = ({ weekSearch, setDuplicatedWeekSearch, mutate, router }) => {
   const t = useTranslations();
   const [isEditing, setIsEditing] = useState(false);
   const [commentsOpen, setCommentsOpen] = useState(false);
   const [text, setText] = useState(weekSearch?.text || "");
   const [commentText, setCommentText] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [visibleComments, setVisibleComments] = useState(5);

   const { onOpen } = useModal();
   const { toast } = useToast();
   const locale = useLocale();
   const handleEdit = () => {
      // Add your edit logic here
      setIsEditing(false);
   };

   const handleDuplicate = () => {
      // Add your duplicate logic here
      setDuplicatedWeekSearch(weekSearch);
   };

   const handleCommentSubmit = async () => {
      if (!commentText.trim()) return;

      setIsLoading(true);

      const user = await getLoggedInUser();

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
         console.error(error);
      } finally {
         setIsLoading(false);
         setCommentText("");
      }
   };

   const deleteWeekSearch = async () => {
      try {
         await deleteDocument("main_db", "week_searches", weekSearch.$id);
         mutate();
         router.refresh();
         toast({
            variant: "success",
            title: "Viikonhaku",
            description: "Viikonhaku on poistettu onnistuneesti."
         })
      } catch (error) {
         console.error(error);
         toast({
            variant: "destructive",
            description: "Tuntematon virhe."
         })
      }
   };

   const handleWeekSearchActivity = async () => {
      try {
         await updateDocument("main_db", "week_searches", weekSearch.$id, {
            is_active: !weekSearch.is_active
         });

         mutate();
         router.refresh();

         toast({
            variant: "success",
            title: "Viikonhaku",
            description: "Viikonhaku on päivitetty onnistuneesti."
         })
      } catch (error) {
         console.error(error);
         toast({
            variant: "internalError",
            description: "Tuntematon virhe."
         });
      }
   };

   const loadMoreComments = () => {
      setVisibleComments(prev => prev + 5);
   };

   const displayedComments = weekSearch.week_search_comments.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).slice(0, visibleComments);
   const hasMoreComments = weekSearch.week_search_comments.length > visibleComments;

   return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
         <div className="p-4">
            {/* Header */}
            <div className="flex items-start gap-4">
               <Avatar className="h-10 w-10">
                  <AvatarFallback>
                     <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                  </AvatarFallback>
               </Avatar>

               <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                     <div>
                        <h3 className="font-semibold text-gray-900">{t("you")}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                           <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDateTime(weekSearch?.$createdAt || weekSearch?.$createdAt, locale)}</span>
                           </div>
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                           <div className="flex items-center gap-1">
                              <ShieldCheck className={cn("h-3.5 w-3.5", weekSearch?.is_active ? "text-green-500" : "text-gray-400")} />
                              <span>{weekSearch?.is_active ? t("active") : t("not_active")}</span>
                           </div>
                        </div>
                     </div>

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => handleWeekSearchActivity()}>
                              <ShieldCheck className={cn("h-4 w-4 mr-2", !weekSearch?.is_active ? "text-green-500" : "text-red-500")} />
                              <span className={!weekSearch?.is_active ? "text-green-500" : "text-red-500"}>{!weekSearch?.is_active ? t("activate") : t("deactivate")}</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setIsEditing(true)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              {t("edit")}
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={handleDuplicate}>
                              <Copy className="h-4 w-4 mr-2" />
                              {t("duplicate")}
                           </DropdownMenuItem>

                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistaa viikonhaun?", callback: deleteWeekSearch })}
                              className="text-red-600"
                           >
                              <Trash className="h-4 w-4 mr-2" />
                              {t("delete")}
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="mt-4">
               {isEditing ? (
                  <div className="space-y-4">
                     <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[100px]"
                     />
                     <div className="flex items-center gap-2 justify-end">
                        <Button
                           variant="outline"
                           onClick={() => setIsEditing(false)}
                        >
                           {t("cancel")}
                        </Button>
                        <Button onClick={handleEdit}>{t("save")}</Button>
                     </div>
                  </div>
               ) : (
                  <>
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
                     <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
                  </>

               )}
            </div>

            <Separator className="my-4" />

            {/* Actions */}
            <div className="flex items-center gap-2">
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => setCommentsOpen(!commentsOpen)}
               >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  <span>{weekSearch.week_search_comments.length}</span>
               </Button>
            </div>
         </div>

         {/* Comments Section */}
         {commentsOpen && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4 rounded-b-xl">
               <div className="space-y-4">
                  {weekSearch.week_search_comments.length > 0 ? (
                     <>
                        <div className="space-y-3">
                           {displayedComments.map((comment) => (
                              <WeekSearchComment key={comment.$id} comment={comment} />
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
                     <p className="text-sm text-gray-500 text-center py-2">{t('no_comments_found')}</p>
                  )}
               </div>
               {/* Add Comment Form */}
               <div className="flex items-center">
                  <Input
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     placeholder={t("write_comment")}
                     className="mr-2 !mt-0"
                  />
                  <Button
                     onClick={handleCommentSubmit}
                     disabled={!commentText.trim()}
                     className="border-0"
                  >
                     {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
};

export default UserWeekSearchItem;