import { useState } from "react";
import { Button } from "../ui/button";


const UserDuplicateWeekSearch = ({ weekSearch, t, handleDuplicateWeekSearch, setDuplicatedWeekSearch }) => {

   const [editorOpen, setEditorOpen] = useState(true);

   const [text, setText] = useState(weekSearch?.text || "");

   return (
      <div className="p-3 border border-indigo-200 rounded-md mt-3">
         <div className="flex items-center">
            <img src={"/blank_profile.png"} alt="avatar" className="w-[50px] h-[50px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full">{t("you")}</strong>
            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p className="text-sm text-gray-700">
            {weekSearch.text}
         </p>
         {editorOpen && (
            <div className="w-full mt-2">
               <textarea className="resize-none h-20 my-3 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="text" value={text} onChange={(e) => setText(e.target.value)} />
               <Button className="rounded-md text-white mt-2" onClick={() => {
                  handleDuplicateWeekSearch(text, weekSearch)
                  setDuplicatedWeekSearch(false);
                  setText("");
               }}>{t("save")}</Button>
            </div>
         )}
      </div>
   )
}

export default UserDuplicateWeekSearch;