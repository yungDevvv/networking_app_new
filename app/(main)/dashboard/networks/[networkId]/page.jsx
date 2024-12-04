"use client"

import { useRouter } from "next/navigation";
import MemberCard from "@/components/member-card";


export default function Page() {
   console.log("asdasdasd")
   // const { t } = useTranslation("common")
   const router = useRouter();
   // const { id: networkId } = router.query;



   return (
      <div>
         <h2 className="text-center font-bold text-lg">RESPOSOLUTIONS OY</h2>
         <div className="my-5">
            <h4 className="font-semibold mb-3">Jäsenet</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
               {/* {
                  members.length !== 0
                     ? members.map((user, i) => <MemberCard key={i} member={user} isAdmin={isAdmin} deleteMemberFromNetwork={deleteMemberFromNetwork} />)
                     : <h3>No users</h3>
               } */}

               <MemberCard />
               <MemberCard />
               <MemberCard />
               <MemberCard />
            </div>
         </div>
         {/* {!isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleLeave()}>Leave</button>}
         {isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleDelete()}>Delete this Network</button>} */}
         <button type="button" className="text-white bg-red-700 p-2 mt-5" >Leave</button>
         <button type="button" className="text-white bg-red-700 p-2 mt-5" >Delete this Network</button>
      </div>
   )
}

