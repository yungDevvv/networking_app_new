import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";

import { useUser } from "@/context/user-context";
import { createDocument } from "@/lib/appwrite/server/appwrite";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InviteModal() {
    const user = useUser();
    const t = useTranslations();

    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "invite-modal";

    const { toast } = useToast();

    const inviteHandle = async (entity_id) => {
        try {
            await createDocument("main_db", "notifications", {
                body: {
                    profiles: data.recipient.$id,
                    type: data.type,
                    sender_id: user.$id,
                    entity_id: entity_id,
                }
            });

            toast({
                variant: "success",
                title: "Kutsu",
                description: "Kutsu on lähetetty onnistuneesti."
            })
            onClose();
        } catch (error) {
            console.log(error);

            toast({
                variant: "destructive",
                title: "Kutsu",
                description: "Tapahtui virhe"
            })
        }
    }

    const invitebleCommunities = user[data.type === "networks" ? "members" : "group_members"];

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="p-6 min-h-[150px]">
                <DialogHeader>
                    <DialogTitle>{data.type === "networks" ? t("invite_network") : t("invite_group")}</DialogTitle>
                    <DialogDescription>{t("send_invitation_description")}</DialogDescription>
                </DialogHeader>

                {invitebleCommunities && invitebleCommunities.length !== 0
                    ? invitebleCommunities.map((arrOfMembers) => (
                        <div key={arrOfMembers[data.type].$id} className="w-full border-b flex justify-between items-center py-5">
                            <strong className="font-semibold text-black text-base">{arrOfMembers[data.type].name}</strong>
                            <Button onClick={() => inviteHandle(arrOfMembers[data.type].$id)}>{t("invite")}</Button>
                        </div>
                    ))
                    : <div className="w-full flex justify-between items-center py-5">
                        <strong className="font-normal text-black text-base">{t("no_groups_to_invite")}</strong>
                    </div>
                }
            </DialogContent>
        </Dialog>
    )
}
