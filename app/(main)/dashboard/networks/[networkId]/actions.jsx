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
    LogOut,
    CirclePlus
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpdateUser } from "@/context/user-context";

const Actions = ({ network, networkId, user }) => {
    const { onOpen } = useModal();
    const router = useRouter();
    const updateUser = useUpdateUser();
    const t = useTranslations();

    const deleteNetworkHandler = async () => {
        try {
            await deleteDocument("main_db", "networks", networkId);
            await updateUser();
            router.push("/dashboard/networks");
        } catch (error) {
            console.log(error);
        }
    }

    const isAdmin = user.role === "admin";

    const deleteMemberFromNetworkHandler = async () => {
        try {
            await deleteDocument("main_db", "members", user.$id);

            await updateUser();
            router.push("/dashboard/networks");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-100 px-3 py-2 rounded-lg relative">
                <span className="sr-only">Open menu</span>
                {network?.join_requests && network?.join_requests.length > 0 && (
                    <div className="absolute -top-1 -right-2 flex mr-2 h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                        {network?.join_requests?.length || 0}
                    </div>
                )}
                <MoreHorizontal className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("confirm-modal", { title: t("are_you_sure"), description: t("confirm_leave_network"), callback: deleteMemberFromNetworkHandler })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("leave_network")}
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <>
                        <DropdownMenuItem onClick={() => onOpen("create-network-modal", { edit: true, network })}>
                            <Settings className="mr-2 h-4 w-4" />
                            {t('network_settings')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpen("join-requests-modal", { network })}>
                            {network?.join_requests && network?.join_requests.length > 0 ? (
                                <div className="flex mr-2 h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                                    {network?.join_requests?.length || 0}
                                </div>
                            ) : (
                                <CirclePlus className="mr-2 h-4 w-4" />
                            )}
                            {t("network_joinrequests")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onOpen("confirm-modal", { title: t("are_you_sure"), description: t("confirm_delete_network", {network}), callback: deleteNetworkHandler })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete_network")}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Actions;