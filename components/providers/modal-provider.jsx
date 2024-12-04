"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import ChooseNetworkModal from "../modals/choose-network-modal";
import CreateMeetingModal from "../modals/create-meeting-modal";

export const ModalProvider = () => {
   const [isMounted, setIsMounted] = useState(false);

   const { isOpen, type } = useModal();

   useEffect(() => {
      setIsMounted(true);
   }, [])

   if (!isMounted) return null;

   return (
      <>
      <ChooseNetworkModal />
         {isOpen && type === "choose_network" && <ChooseNetworkModal /> }
         {isOpen && type === "create-meeting" && <CreateMeetingModal />}
      </>
   )
}