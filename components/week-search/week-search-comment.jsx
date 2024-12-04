import { formatDate } from "@/lib/utils";
import { Fragment } from "react";

const WeekSearchComment = ({ comment }) => {
   return (
      <Fragment>
         <div className="flex">
            <img src={"/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" />
            {/* <img src={"/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" /> */}
            <div className="ml-2 -mt-1">
               <div className="flex items-center">
                  <h4 className="font-semibold mr-3">Semen Meliachenko</h4>
                  <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
               </div>
               <p>Hyvä, haluan ottaa yhteyttä!</p>
            </div>
         </div>
         <hr className="my-4" />
      </Fragment>

   )
}

export default WeekSearchComment;