"use client"

import { CircleArrowRight, SquarePlus } from "lucide-react";
// import { useModal } from "../../context/ModalProvider";
import Link from "next/link";


export default function Page() {
   // const { openModal } = useModal();

   return (
      <div>
         <div className="w-full flex justify-between mb-4">
            <h1 className="text-xl font-bold">Suosikit</h1>
            {/* <button type="button" onClick={() => openModal("create-network")}> */}
            <button type="button">
               <SquarePlus className="text-green-500" />
            </button>
         </div>
         <div className="space-y-6 w-full">
            {/* {networks.length !== 0
               ? networks.map((network) => (a
                  <Link
                     href={"/network/" + network.id}
                     key={network.id}
                     className="bg-white w-full border rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
                  >
                     <h3 className="text-lg font-semibold">{network.name}</h3>
                     <button>
                        <CircleArrowRight strokeWidth={1.25} />
                     </button>
                  </Link>
               ))
               : <span>{t("asd200")}</span>
            } */}
            <Link
               href={"/dashboard/networks/123"}
               className="bg-white w-full border rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
            >
               <h3 className="text-lg font-semibold">RESPOSOLUTIONS OY</h3>
               <button>
                  <CircleArrowRight strokeWidth={1.25} />
               </button>
            </Link>
         </div>
      </div>
   )
}

