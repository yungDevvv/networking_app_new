"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useModal } from "@/hooks/use-modal"
import { useTranslations } from "next-intl";



const ConfirmImageModal = () => {
    const t = useTranslations(); 

    const { isOpen, type, onClose, data } = useModal();

    const isModalOpen = isOpen && type === "confirm-image-modal";
    
    return (
        <AlertDialog open={isModalOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {data.description}
                    </AlertDialogDescription>
                    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                        <img 
                            src={data.image} 
                            alt="Preview" 
                            className="object-cover w-full h-full"
                        />
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-between">
                    <AlertDialogCancel>Peruuta</AlertDialogCancel>
                    <AlertDialogAction onClick={() => data.callback()} className="bg-indigo-500 hover:bg-indigo-600 text-white">{t("save")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmImageModal;