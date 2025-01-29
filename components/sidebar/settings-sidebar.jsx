"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import { useUser } from "@/context/user-context";
import React from 'react';
import { useModal } from "@/hooks/use-modal";
import { createFile, updateDocument } from "@/lib/appwrite/server/appwrite";
import { storage } from "@/lib/appwrite/client/appwrite";
import { Separator } from "../ui/separator";

export default function SettingsSidebar() {
    const pathname = usePathname();
    const user = useUser();
    const t = useTranslations();
    const fileInputRef = React.useRef(null);
    const router = useRouter();
    const { onOpen } = useModal();

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmitAvatar = async () => {
        try {
            const file_id = await createFile("avatars", null, fileInputRef.current.files?.[0]);

            if (file_id) {
                const res = await updateDocument("main_db", "profiles", user.$id, {
                    avatar: file_id
                });

                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);

            onOpen("confirm-image-modal", {
                title: "Vaihda profiilikuva",
                description: "Haluatko varmasti vaihtaa profiilikuvaasi?",
                image: imageUrl,
                callback: handleSubmitAvatar,
                mode: "avatar"
            });
        }
    };

    const items = [
        // {
        //    title: "Koti",
        //    url: "/dashboard",
        //    icon: (isActive) => (
        //       <Home
        //          className={cn("!w-5 !h-5 mr-1", isActive && "text-indigo-500")}
        //       />
        //    ),
        // },
        {
            title: t("profile"),
            url: "/dashboard/account/profile",
        },
        {
            title: t("notifs"),
            url: "/dashboard/account/notifications"
        },
        {
            title: t("mine_settings"),
            url: "/dashboard/account/settings"
        },
        {
            title: "Kutsu käyttäjät",
            url: "/dashboard/account/invite"
        },
    ];

    return (
        <>
            <div className="flex flex-col space-y-4 pr-1 max-w-[180px] max-sm:w-full max-sm:max-w-[100%] max-sm:flex-row max-sm:items-center max-sm: justify-between">
                <div className="relative select-none max-xl:p-3 max-sm:max-w-[130px]">
                    <Avatar className="w-full h-full relative ring-4 ring-indigo-500">
                        <AvatarImage className="p-1 h-full w-full rounded-full object-cover" src={`${storage.getFilePreview("avatars", user.avatar)}`} alt="avatar" />
                        <AvatarFallback>
                            <img className="aspect-square h-full w-full rounded-full p-1" src="/blank_profile.png" alt="avatar_fallback" />
                        </AvatarFallback>
                    </Avatar>
                    <div onClick={handleImageClick} className="absolute cursor-pointer bottom-1 right-1 z-50 !rounded-full bg-indigo-500 w-10 h-10 flex items-center justify-center">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <Camera className="text-white" />
                    </div>
                </div>

                <div className="flex flex-col space-y-2 !mt-10 select-none max-sm:!mt-0 min-w-[160px]">
                    {
                        items.map((item) => {
                            const isActive = pathname === item.url;

                            return (
                                // <Button key={item.url} asChild>
                                <Link key={item.url} href={item.url} className={cn("font-medium h-10 flex items-center w-full justify-start rounded-lg px-4 hover:bg-sidebar-accent relative", pathname.includes(item.url) && "bg-indigo-50")}>
                                    {<span>{item.title}</span>}
                                    {item.url === "/dashboard/account/notifications" && user?.notifications?.length >= 0 && <span className="bg-red-500 text-white flex items-center justify-center font-semibold absolute top-0 -right-2 rounded-full text-xs w-5 h-5">{user.notifications.length}</span>}
                                </Link>
                                // </Button>
                            )
                        })
                    }
                </div>
            </div>
            <Separator className="hidden max-sm:block my-5" />
        </>

    );
}