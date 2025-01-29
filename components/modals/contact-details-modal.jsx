"use client";

import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";
import { MapPin, Mail } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

export function ContactDetailsModal() {
    const { type, isOpen, onClose, data } = useModal();
    const t = useTranslations();
    const isModalOpen = isOpen && type === "contact-details-modal";

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl p-0">
                <DialogTitle className="hidden"></DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
                <div>
                    <Card className="border-0 shadow-none">
                        <CardHeader></CardHeader>
                        <CardContent>
                            <div className='bg-gray-100 rounded-lg p-4 space-y-4'>
                                <h3 className="text-lg font-medium">{data.contact_offer.offers.title}</h3>
                                <p className="text-sm">{data.contact_offer.offers.description}</p>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span className="font-medium mr-2">Sijainti:</span>
                                        <span>{data.contact_offer.offers.location}</span>
                                    </div>
                                    <div className="text-lg flex items-center font-bold text-indigo-600">
                                        <span>{format(data.contact_offer.offers.start_date, "dd.MM.yyyy")}</span>
                                        <span className="mx-3"> - </span>
                                        <span>{format(data.contact_offer.offers.end_date, "dd.MM.yyyy")}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 rounded-xl">
                                        <AvatarImage className="h-full w-full object-cover" src="/blank_profile.png" />
                                        <AvatarFallback>
                                            <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">Semen Meliachenko</p>
                                        <p className="text-sm text-gray-500">5 minuuttia sitten</p>
                                    </div>
                                </div>
                                <div className="border border-indigo-100 p-4 rounded-lg flex">
                                    <Mail className="h-5 w-5 text-indigo-600 shrink-0 mr-3" />
                                    <p className='-mt-1'>Hei! Olen kiinnostunut tästä tarjouksesta. Minulla on kokemusta videoeditoinnista ja olen työskennellyt useiden YouTube-projektien parissa. Voisin auttaa sinua luomaan laadukasta sisältöä kanavallesi.</p>
                                </div>
                                <div className="space-y-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Puhelin:</span>
                                            <p>+358 40 123 4567</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Sähköposti:</span>
                                            <p>semen@example.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ContactDetailsModal;
