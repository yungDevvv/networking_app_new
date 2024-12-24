import { storage } from "@/lib/appwrite/client/appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDateTime } from "@/lib/utils";

const WeekSearchComment = ({ comment }) => {
   console.log(comment)
   return (
      <div className="rounded-lg py-4 px-5 max-xl:py-0 pb-3 transition-all w-full">
         <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 shrink-0 rounded-full">
               {/* <AvatarImage src={storage.getFilePreview("avatars", comment.profiles.avatar)} alt={comment.profiles.name} srcSet={ comment.profiles.avatar} /> */}
               <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", comment.profiles.avatar)} />
               <AvatarFallback>
                  <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
               </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900">{comment.profiles.name}</span>
                  <span className="text-sm text-gray-500">{formatDateTime(comment.$createdAt, "fi")}</span>
               </div>
               <div className="max-w-full">
                  <p className="text-sm text-gray-700 break-words max-w-full">
                     {comment.text}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WeekSearchComment;