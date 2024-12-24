import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";
import { useDocuments } from "@/hooks/use-documents";
import { useUser } from "@/context/user-context";
import { createDocument } from "@/lib/appwrite/server/appwrite";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

export default function InviteModal() {
    const user = useUser();
    console.log(user);
    const t = useTranslations();

    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "invite-modal";

    const inviteHandle = async (entity_id) => {
        try {
            const res = await createDocument("main_db", "notifications", {
                body: {
                    profiles: data.recipient.$id,
                    type: data.type,
                    sender_id: user.$id,
                    entity_id: entity_id,
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

    // const invitebleCommunities = user[data.type].filter((com) => {
    //     return !com.members.find((member) => member.profiles === data.recipient.$id);
    // });
    console.log(user[data.type === "networks" ? "members" : "group_members"])
    const invitebleCommunities = user[data.type === "networks" ? "members" : "group_members"]  // [data.type === "networks" ? "networks" : "groups"];

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="p-6 min-h-[150px]">
                <DialogHeader>
                    <DialogTitle>{data.type === "networks" ? t("invite_network") : t("invite_group")}</DialogTitle>
                    <DialogDescription>Lähetä kutsu käyttäjälle, ja hän saa sen ilmoituksiinsa.</DialogDescription>
                </DialogHeader>
                {invitebleCommunities && invitebleCommunities.length !== 0
                    ? invitebleCommunities.map((arrOfMembers) => {
                        console.log(arrOfMembers, "arrOfMembers");
                        return (
                            <div key={arrOfMembers[data.type].$id} className="w-full border-b flex justify-between items-center py-5">
                                <strong className="font-semibold text-black text-base">{arrOfMembers[data.type].name}</strong>
                                <Button onClick={() => inviteHandle(arrOfMembers[data.type].$id)}>{t("invite")}</Button>
                            </div>
                        )
                    })
                    : <div className="w-full flex justify-between items-center py-5">
                        <strong className="font-normal text-black text-base">Ei ole ryhmiä, joihin voisi lähettää kutsun.</strong>
                    </div>
                }
            </DialogContent>
        </Dialog>
    )
}
