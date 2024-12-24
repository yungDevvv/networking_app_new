"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import ChooseNetworkModal from "../modals/choose-network-modal";
import CreateMeetingModal from "../modals/create-meeting-modal";
import ProfileModal from "../modals/profile-modal";
import { CreateNetworkModal } from "../modals/create-network-modal";
import ConfirmModal from "../modals/confirm-modal";
import InviteModal from "../modals/invite-modal";
import { CreateGroupModal } from "../modals/create-group-modal";
import ConfirmImageModal from "../modals/confirm-image-modal";
import { CreateCompanyModal } from "../modals/create-company-modal";

export const ModalProvider = () => {
   const [isMounted, setIsMounted] = useState(false);

   const { isOpen, type } = useModal();

   useEffect(() => {
      setIsMounted(true);
   }, [])

   if (!isMounted) return null;

   return (
      <>
         {isOpen && type === "invite-modal" && <InviteModal />}
         {isOpen && type === "confirm-image-modal" && <ConfirmImageModal />}
         {isOpen && type === "confirm-modal" && <ConfirmModal />}
         {isOpen && type === "create-network-modal" && <CreateNetworkModal />}
         {isOpen && type === "create-company-modal" && <CreateCompanyModal />}
         {isOpen && type === "create-group-modal" && <CreateGroupModal />}
         {isOpen && type === "choose_network" && <ChooseNetworkModal />}
         {isOpen && type === "create-meeting" && <CreateMeetingModal />}
         {isOpen && type === "profile-modal" && <ProfileModal />}
      </>
   )
}