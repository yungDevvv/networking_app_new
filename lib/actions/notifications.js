"use server"

import { getDocument, updateDocument } from "@/lib/appwrite/server/appwrite";

export async function acceptInvitation(notificationId) {
    // try {
    //     const notification = await getDocument("main_db", "notifications", notificationId);
        
    //     if (notification.type === "network") {
    //         // Add user to network members
    //         const network = await getDocument("main_db", "networks", notification.entityId);
    //         await updateDocument("main_db", "networks", notification.entityId, {
    //             members: [...network.members, { profiles: notification.userId }]
    //         });
    //     } else {
    //         // Add user to group members
    //         const group = await getDocument("main_db", "groups", notification.entityId);
    //         await updateDocument("main_db", "groups", notification.entityId, {
    //             members: [...group.members, { profiles: notification.userId }]
    //         });
    //     }

    //     // Mark notification as accepted
    //     await updateDocument("main_db", "notifications", notificationId, {
    //         status: "accepted"
    //     });

    //     return true;
    // } catch (error) {
    //     console.error("Error accepting invitation:", error);
    //     throw error;
    // }
}

export async function rejectInvitation(notificationId) {
    // try {
    //     // Mark notification as rejected
    //     await updateDocument("main_db", "notifications", notificationId, {
    //         status: "rejected"
    //     });

    //     return true;
    // } catch (error) {
    //     console.error("Error rejecting invitation:", error);
    //     throw error;
    // }
}
