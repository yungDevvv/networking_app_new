"use client";

import { Calendar, Clock, MapPin, Trash2, SquarePen, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";
import { fi, enUS } from 'date-fns/locale'
import { deleteDocument, } from "@/lib/appwrite/server/appwrite";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { storage } from "@/lib/appwrite/client/appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


const MeetItem = ({ meet, locale }) => {
    const { onOpen } = useModal();
    const { toast } = useToast();
    const router = useRouter();
    const t = useTranslations();

    const handleDeleteMeetItem = async () => {
        try {
            const res = await deleteDocument("main_db", "meets", meet.$id);

            toast({
                variant: "success",
                title: "Tapaaminen",
                description: "Tapaaminen poistettu onnistuneesti."
            })
        } catch (error) {
            console.error(error);
            toast({
                variant: "internalError",
                description: "Tuntematon virhe poistaessa tapaamista."
            });
        }

        router.refresh();
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 mb-4">
                <div className="space-y-4">
                    {/* Header with title and actions */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-gray-900">{meet.title}</h3>
                            <p className="text-sm text-gray-500">
                                {format(new Date(meet.date), "PPP", { locale: locale === "fi" ? fi : enUS })}
                            </p>
                        </div>
                        <div className="flex gap-1.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                onClick={() => onOpen("create-meeting", { edit: true, meet })}
                            >
                                <SquarePen size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                onClick={() => onOpen("confirm-modal", {
                                    title: t("are_you_sure"),
                                    description: t("confirm_delete_meeting"),
                                    callback: handleDeleteMeetItem
                                })}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Meeting details */}
                    <div className="flex justify-between max-xs:flex-col gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700 gap-2.5">
                            <div className="rounded-lg bg-indigo-50 p-2 shadow-sm">
                                <Clock size={18} className="text-indigo-500" />
                            </div>
                            <span className="text-sm font-medium">{meet.start_time} - {meet.end_time}</span>
                        </div>
                        <div className="flex items-center text-gray-700 gap-2.5">
                            <div className="rounded-lg bg-indigo-50 p-2 shadow-sm">
                                <MapPin size={18} className="text-indigo-500" />
                            </div>
                            <span className="text-sm font-medium">{meet.location}</span>
                        </div>

                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {meet.description && (
                            <div className="flex items-center text-gray-700 gap-2.5">
                                <div className="rounded-lg self-start bg-indigo-50 p-2 shadow-sm">
                                    <FileText size={18} className="text-indigo-500" />
                                </div>
                                <span className="text-sm font-medium max-w-[500px]">{meet.description}</span>
                            </div>
                        )}
                    </div>
                    {/* Participants */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3">
                            <div className="relative"> 
                                <Avatar className="h-14 w-14 rounded-xl ring-2 ring-gray-100">
                                    <AvatarImage src={storage.getFilePreview("avatars", meet.profiles.avatar)} alt={meet.profiles?.name} className="object-cover" />
                                    <AvatarFallback className="bg-indigo-50">
                                        <img src={'/blank_profile.png'} alt="avatar" className="h-full w-full object-cover" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">{meet.profiles.name}</p>
                                <p className="text-gray-500 text-sm">{meet.profiles.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MeetItem;