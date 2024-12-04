"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import ConfirmModal from "../../components/modals/confirm-modal"
import UserDuplicateWeekSearch from "@/components/week-search/user-duplicate-week-search"
import UserWeekSearchItem from "@/components/week-search/user-week-search-item"

export default function My() {

   const [confirmStatus, setConfirmStatus] = useState(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
   const [duplicatedWeekSearch, setDuplicatedWeekSearch] = useState(null);
   const [text, setText] = useState("");
   const [weekSearches, setWeekSearches] = useState([]);
   const router = useRouter()

   return (
      <div className="max-w-[850px] mx-auto">
         <div className="border border-indigo-200 p-3 rounded-md">
            <p className="font-semibold">Kirjoita viikoittainen hakupyyntösi tähän</p>
            <small className="text-gray-500 block">
               Määritä ketä tai mitä etsit. Pyyntö on voimassa viikon ja näkyy muille käyttäjille.
            </small>
            <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="Esimerkiksi: Etsimme markkinoinnin päättäjiä yritykseen XXX Oy." className="p-2 h-32 resize-none w-full mt-5 shadow-sm border border-indigo-200 rounded-md" />
            <button className="w-40 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Lähetä</button>
         </div>
         {true && <UserDuplicateWeekSearch />}
         {/* {weekSearches.length !== 0
            ? weekSearches.map(weekSearch => <UserWeekSearchItem setDuplicatedWeekSearch={setDuplicatedWeekSearch} avatar={profile.avatar} profileId={profile.id} key={weekSearch.id} weekSearch={weekSearch} />)
            : <span className="block mt-4">{t("asd400")}</span>
         } */}
         <UserWeekSearchItem />
         <UserWeekSearchItem />
         <UserWeekSearchItem />
         <UserWeekSearchItem />
         <UserWeekSearchItem />
         <UserWeekSearchItem />
         {/* {confirmModalOpen && <ConfirmModal setConfirmStatus={setConfirmStatus} setConfirmOpen={setConfirmOpen} />} */}
      </div>
   )
}
