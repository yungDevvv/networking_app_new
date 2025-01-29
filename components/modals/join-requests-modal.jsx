"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { listDocuments, updateDocument, deleteDocument, createDocument } from "@/lib/appwrite/server/appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModal } from "@/hooks/use-modal";
import { storage } from "@/lib/appwrite/client/appwrite";
import { useRouter } from "next/navigation";

const JoinRequestsModal = () => {
    const t = useTranslations();
    const { toast } = useToast();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "join-requests-modal";
    


    const handleRequest = async (requestId, action) => {
        try {
            setIsLoading(true);
            if (action === 'accept') {
                await createDocument("main_db", "members", {
                    body: {
                        profiles: data.network.join_requests.find(request => request.$id === requestId).profiles.$id,
                        networks: data.network.$id,
                    }
                })
                //TODO: Send notification about accepting
            } else {
                //TODO: Send notification about rejecting
            }
      
            await deleteDocument("main_db", "join_requests", requestId);
            router.refresh();
            toast({
                variant: "success",
                description: action === 'accept' ? t("request_accepted") : t("request_rejected")
            });

        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: t("error_processing_request")
            });
        } finally {
            setIsLoading(false);
        }
    };
    console.log(data.network)
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mb-4">
                    <UserPlus2 className="mr-2 h-4 w-4" />
                    {t("join_requests")}
                    <Badge variant="secondary" className="ml-2">
                        {data.network.join_requests?.length}
                    </Badge>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("join_requests")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {data.network.join_requests.length !== 0 && data.network.join_requests.map((request) => (
                        <div key={request.$id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-14 w-14 rounded-xl ring-2 ring-gray-100">
                                    <AvatarImage src={storage.getFilePreview("avatars", request.profiles.avatar)} alt={"profile_image"} className="object-cover" />
                                    <AvatarFallback className="bg-indigo-50"> 
                                        <img src={'/blank_profile.png'} alt="avatar" className="h-full w-full object-cover" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{request.profiles.name}</p>
                                    <p className="text-sm text-muted-foreground">{request.profiles.email}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600"
                                    onClick={() => handleRequest(request.$id, 'accept')}
                                    disabled={isLoading}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600"
                                    onClick={() => handleRequest(request.$id, 'reject')}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JoinRequestsModal;