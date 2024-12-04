import { Clock, MapPin, MessageSquare } from "lucide-react";

import { Fragment, useEffect, useState } from "react";

import { formatDateTime } from "@/lib/utils";
import WeekSearchComment from "./week-search-comment";

const WeekSearchItem = () => {

   const [commentsOpen, setCommentsOpen] = useState(false);
   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState('');

   return (
      <div className="p-3 border border-indigo-200 rounded-md mt-3">
         <div className="flex items-center">
            <img src={"/blank_profile.png"} alt="avatar" className="w-[50px] h-[50px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full">Semen Meliachenko</strong>
               <div className="flex items-center">
                  <MapPin size={16} className="text-indigo-600 mr-1" />
                  <span className="text-sm">Helsinki</span>
               </div>
            </div>
            <div className="ml-auto self-start">
               <div className="flex items-center">
                  <Clock size={16} className="text-indigo-600 mr-1" />
                  <span className="text-sm text-gray-500">{formatDateTime(new Date(), "fi")}</span>
               </div>

            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p>
            Haen asiakkaita meidän kaupamme! Ota rohkeasti yhteyttä!
         </p>

         <div className="mt-4">
            {/* <button onClick={() => handleDelete(weekSearch.id)} type="button" className="bg-red-600 rounded-md py-1 px-2">
               <Trash2 size={20} color="#fff" />
            </button>
            <button onClick={() => setEditorOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2">
               <FilePenLine size={20} color="#fff" />
            </button> */}
            <button onClick={() => setCommentsOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2 flex items-center">
               <MessageSquare size={20} color="#fff" />
               <span className="text-white ml-1 -mt-1">5</span>
            </button>
         </div>

         {commentsOpen && (
            <Fragment>
               <hr className="border-indigo-200 my-3" />
               <div className="p-3 rounded-md bg-gray-100">
                  {/* {comments.length !== 0
                     ? comments.map(comment => <WeekSearchComment key={comment.id} comment={comment} />)
                     : <p className="mb-2 font-mono">No comments yet...</p>
                  } */}
                  <WeekSearchComment />
                  <WeekSearchComment />
                  <WeekSearchComment />
                  <WeekSearchComment />
                  <WeekSearchComment />
                  <div className="flex items-center">
                     <img src={"/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" />
                     <div>
                        <textarea onChange={(e) => setCommentText(e.target.value)} value={commentText} placeholder="Add comment" className="block p-2 h-24 resize-none w-72 shadow-sm border border-indigo-200 rounded-md"></textarea>
                        <button className="mt-2 float-end bg-indigo-600 text-white py-1.5 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
                     </div>
                  </div>
               </div>
            </Fragment>
         )}
      </div>
   )
}

export default WeekSearchItem;