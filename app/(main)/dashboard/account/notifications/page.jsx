
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
            entity: await getDocument("main_db", notification.type, notification.entity_id)
        };
    }));

    const mySendedNotifications = 1;
    const isLoading = false;
    const notifications = [];

    return (
        <div className="w-full max-w-5xl px-10 mx-auto">
            <div className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {t("notifications")}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t("notifications_description")}
                        </p>
                    </div>
                </div>
                <ScrollArea className="h-[600px] w-full rounded-md mt-16">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : user.notifications?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/50" />
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
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}