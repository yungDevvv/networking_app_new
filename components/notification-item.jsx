"use client"

import { useTranslations } from "next-intl";
import { Loader2, UserPlus, Users, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useLocale } from 'next-intl';
import { fi, enUS } from 'date-fns/locale'
import { createDocument, deleteDocument } from "@/lib/appwrite/server/appwrite";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const NotificationItem = ({
    notification,
    user

}) => {
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();

    const onAccept = async () => {
        setIsLoading1(true);
        try {
            if (notification.type !== "review") {
                const res1 = await createDocument("main_db", notification.type === "networks" ? "members" : "group_members", {
                    body: {
                        [notification.type]: notification.entity.$id,
                        profiles: user.$id
                    }
                });

                const res2 = await deleteDocument("main_db", "notifications", notification.$id);
            } else {
                window.open(notification.entity, '_blank');
                const res2 = await deleteDocument("main_db", "notifications", notification.$id);
            }

            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            router.refresh();
            setIsLoading1(false)
        }
    }
    const onReject = async () => {
        setIsLoading2(true);
        try {
            const res2 = await deleteDocument("main_db", "notifications", notification.$id);
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            router.refresh();
            setIsLoading2(false)
        }
    }
    return (
        <div className="flex items-start justify-between p-4 hover:bg-muted/50 user-select-none cursor-default">
            <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                    {notification.type === "networks" && <Users className="h-4 w-4 text-primary" />}
                    {notification.type === "groups" && <UserPlus className="h-4 w-4 text-primary" />}
                    {notification.type === "review" && <Link className="h-4 w-4 text-primary" />}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                        {notification.sender.name}
                    </p>
                    {notification.type !== "review"
                        ? <p className="text-sm text-muted-foreground">
                            {t("invited_you")} {notification.type === "networks" ? t("to_network") : t("to_group")} <span className="text-base font-medium text-indigo-500">{notification.entity.name}</span>
                        </p>
                        : <p className="text-sm text-muted-foreground">{t("review_request_received")}</p>
                    }
                    <p>

                    </p>

                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.$createdAt), {
                            addSuffix: true,
                            locale: locale === "fi" ? fi : enUS
                        })}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(notification.$id)}
                >
                    {isLoading2 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("reject")}
                </Button>
                <Button
                    size="sm"
                    onClick={() => onAccept(notification.$id)}
                >
                    {isLoading1 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("accept")}

                </Button>
            </div>
        </div>
    );
};
