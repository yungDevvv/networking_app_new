"use client";

import { useModal } from "@/hooks/use-modal";
import { deleteDocument, updateDocument } from "@/lib/appwrite/server/appwrite";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {
    Settings,
    Share2,
    Trash2,
    MoreHorizontal,
    LogOut
} from "lucide-react";
import { useTranslations } from "next-intl";

const Actions = ({ group, user }) => {
    const t  = useTranslations();

    const { onOpen } = useModal();
    const router = useRouter();

    const deleteGroupHandler = async () => {
        try {
            await deleteDocument("main_db", "groups", group.$id);

            router.push("/dashboard/groups");
        } catch (error) {
            console.log(error);
        }
    }

    const isAdmin = user.role === "admin";

    const deleteMemberFromGroupHandler = async () => {
       
        try {
            await deleteDocument("main_db", "group_members", user.$id);

            router.push("/dashboard/groups");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-100 px-3 py-2 rounded-lg">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistua verkostosta?", callback: deleteMemberFromGroupHandler })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("leave_group")}
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <>
                        <DropdownMenuItem onClick={() => onOpen("create-group-modal", { networkId, mode: "edit" })}>
                            <Settings className="mr-2 h-4 w-4" />
                            {t("group_settings")}
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Invite Members
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistua verkoston?", callback: deleteGroupHandler })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete_group")}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Actions;