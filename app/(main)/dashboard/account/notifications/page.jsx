
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { NotificationItem } from "@/components/notification-item";
import { acceptInvitation, rejectInvitation } from "@/lib/actions/notifications";
import { getDocument, getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const user = await getLoggedInUserProfile();

    const t = await getTranslations();

    const transformedNotifications = await Promise.all(user.notifications.filter(notif => notif.sender_id !== user.$id).map(async (notification) => {
        return {
            $id: notification.$id,
            $createdAt: notification.$createdAt,
            $updatedAt: notification.$updatedAt,
            type: notification.type,
            status: notification.status,
            sender: await getDocument("main_db", "profiles", notification.sender_id),
            entity: notification.type !== "review" ? await getDocument("main_db", notification.type, notification.entity_id) : notification.entity_id,
        };
    }));

    const mySendedNotifications = 1;
    const isLoading = false;
    const notifications = [];

    return (
        <div className="w-full max-w-5xl pl-10 max-lg:pl-5 mx-auto h-full pb-10 max-sm:pl-0">
            <div className="relative overflow-hidden">

                <h2 className="text-2xl font-semibold mb-10 max-md:text-xl max-md:mb-5">
                    {t("notifs")}
                </h2>

                <ScrollArea className="h-[600px] w-full rounded-md mt-16">
                    {
                        user.notifications?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <Bell className="h-12 w-12 text-indigo-500" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    {t("no_notifications")}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t("no_notifications_description")}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {transformedNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.$id}
                                        notification={notification}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )
                    }
                </ScrollArea>
            </div>
        </div>
    );
}