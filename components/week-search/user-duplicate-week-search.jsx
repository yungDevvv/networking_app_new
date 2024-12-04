import { useState } from "react";


const UserDuplicateWeekSearch = () => {

   const [editorOpen, setEditorOpen] = useState(true);

   const [text, setText] = useState("Etsin jotain auttakaa!");


   return (
      <div className="p-3 border border-indigo-200 rounded-md mt-3">
         <div className="flex items-center">
            <img src={"/blank_profile.png"} alt="avatar" className="w-[50px] h-[50px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full">You</strong>
            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p>
            "Etsin jotain auttakaa!"
         </p>
         {editorOpen && (
            <div className="w-full mt-2">
               <textarea className="resize-none h-20 mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="text" value={text} onChange={(e) => setText(e.target.value)} />
               <button className="bg-green-500 rounded-md text-white px-2 py-1 mt-2">Tallenna</button>
            </div>
         )}
      </div>
   )
}

export default UserDuplicateWeekSearch;