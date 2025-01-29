"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { createDocument } from "@/lib/appwrite/server/appwrite";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RequestJoin = ({ network_id, user_id }) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const handleJoinRequest = async () => {
        try {
            setIsLoading(true);
            await createDocument("main_db", "join_requests", {
                body: {
                    networks: network_id,
                    profiles: user.$id,
                },
            });

            toast({
                variant: "success",
                title: "Liittymispyyntö",
                description: "Liittymispyyntö on lähetetty onnistuneesti.",
            });
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Tuntematon virhe",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">{t("not_network_member")}</h1>
                <p className="text-muted-foreground">{t("join_network_description")}</p>
            </div>

            <Button className="w-full max-w-sm" size="lg" onClick={handleJoinRequest} disabled={isLoading}>
                <UserPlus2 className="mr-2 h-5 w-5" />
                {t("send_join_request")}
            </Button>
        </div>
    );
};

export default RequestJoin;