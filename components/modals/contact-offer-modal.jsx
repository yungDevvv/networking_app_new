"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createDocument } from "@/lib/appwrite/server/appwrite";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";

// Tarjouksen yhteydenotto modaali
export function ContactOfferModal() {
    const { type, isOpen, onClose, data } = useModal();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const user = useUser();
    const isModalOpen = isOpen && type === "create-contact-offer-modal";

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            await createDocument("main_db", "contact_offers", {
                body: {
                    profiles: data.offer.profiles.$id,
                    sender: user.$id,
                    text: message,
                    offers: data.offer.$id
                },
            });
            toast({
                variant: "success",
                title: "Yhteydenotto",
                description: "Yhteydenotto on lähetetty onnistuneesti.",
            })
            onClose();
        } catch (error) {
            console.error(error);
            toast({
                description: "Yhteydenotto lähetys epäonnistui",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Lähetä viesti</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 my-2">
                    <Textarea
                        placeholder="Kirjoita viestisi tähän..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={onSubmit}
                        disabled={!message.trim() || isLoading}
                    >
                        Lähetä
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ContactOfferModal;
