"use client"

import { formatDateTime } from "@/lib/utils";
import { Clock, MapPin } from "lucide-react";

import { useEffect, useState } from "react";

const ProfileWeekSearchItem = ({ weekSearch, profileId, avatar }) => {

   const [commentsOpen, setCommentsOpen] = useState(false);
   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState('');

   return (
      <div className="2xl:p-3 p-2 border border-indigo-200 rounded-md mb-3">
         <div className="flex items-center">
            <img src={"/blank_profile.png"} alt="avatar" className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] mr-2 rounded object-contain" />
            <div>
               <h3 className="font-medium w-full text-md max-xl:text-sm">Semen Meliachenko</h3>
               <div className="flex items-center">
                  <MapPin size={16} className="text-indigo-500" />
                  <span className="xl:text-sm text-xs">Helsinki</span>
               </div>
            </div>
            <div className="ml-auto self-start">
               <div className="flex items-center">
                  <Clock className="text-indigo-500 mr-1 w-[16px]" />
                  <span className="xl:text-sm text-xs text-gray-500 ">{formatDateTime(new Date(), "fi")}</span> 
               </div>
              
            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione, quam illo ab obcaecati totam ad deleniti ut rerum, inventore quaerat aut fuga officia, numquam nam. Qui magni id nobis?
         </p>
      </div>
   )
}

export default ProfileWeekSearchItem;