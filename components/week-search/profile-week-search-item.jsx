"use client"

import { Clock, MapPin, Tag } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { storage } from "@/lib/appwrite/client/appwrite";

const ProfileWeekSearchItem = ({ weekSearch }) => {
   return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 transition-all">
         <div className="p-4">
            {/* Header */}
            <div className="flex items-start gap-4">
               <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", weekSearch.profiles.avatar)} />
                  <AvatarFallback>
                     <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                  </AvatarFallback>
               </Avatar>

               <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                     <div>
                        <h3 className="font-semibold text-gray-900">{weekSearch.profiles.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                           <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{weekSearch.profiles.location}</span>
                           </div>
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                           <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDateTime(new Date(weekSearch.$createdAt), "fi")}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="mt-4">
               <p className="text-gray-700 leading-relaxed">
                  {weekSearch.text}
               </p>

               <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                     <Tag className="h-3.5 w-3.5" />
                     <span>Business</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                     <Tag className="h-3.5 w-3.5" />
                     <span>Marketing</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfileWeekSearchItem;