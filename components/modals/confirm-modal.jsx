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
import { useTranslations } from 'next-intl';

const ConfirmModal = () => {
    const { isOpen, type, onClose, data } = useModal();
    const t = useTranslations();

    const isModalOpen = isOpen && type === "confirm-modal";

    return (
        <AlertDialog open={isModalOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {data.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    {data?.type === "mail"
                        ? <AlertDialogAction onClick={() => data.callback()} className="bg-indigo-500 hover:bg-indigo-600 text-white">{t("confirm")}</AlertDialogAction>
                        : <AlertDialogAction onClick={() => data.callback()} className="bg-red-500 hover:bg-red-600 text-white">{t("yes_delete")}</AlertDialogAction>
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal;