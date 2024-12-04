import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation';

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";

function ChooseNetworkModal({ userProfileId }) {

   const { isOpen, onClose, type, data } = useModal();
   const [userNetworks, setUserNetworks] = useState([])

   const isModalOpen = isOpen && type === "choose-network";

   const [message, setMessage] = useState("")
   const [error, setError] = useState("")
   const router = useRouter();


   if (!isOpen) return null;

   return (
      <Dialog className="block" open={isOpen && type === "choose_network"} onOpenChange={onClose}>
         <DialogContent className="p-6">
            <DialogHeader>
               <DialogTitle>Valitse verkosto</DialogTitle>
               <DialogDescription>
                  {message && <p className="py-2 text-green-600">{message}</p>}
                  {error && <p className="py-2 text-red-600">{error}</p>}
                  <div className="space-y-3">
                     {/* {userNetworks.length !== 0
                           ? userNetworks.map((network) => (
                              <button key={network.id} type="button" className="w-full border rounded border-indigo-500 py-3 hover:shadow-md" onClick={() => handle(network.id)}>
                                 {network.name}
                              </button>
                           ))
                           : <span>{t("networks_not_found")}</span>
                        } */}
                     <div className="w-full border-b flex justify-between items-center py-5">
                        <strong className="font-semibold text-black text-base">RespaSolutions Oy</strong>
                        <Button>Lähetä</Button>
                     </div>
                     <div className="w-full border-b flex justify-between items-center py-5" >
                        <strong className="font-semibold text-black text-base">Zalando Team</strong>
                        <Button>Lähetä</Button>

                     </div>
                     <div className="w-full border-b flex justify-between items-center py-5" >
                        <strong className="font-semibold text-black text-base">Work Oy</strong>
                        <Button>Lähetä</Button>
                     </div>
                  </div>
               </DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   )
}

export default ChooseNetworkModal;