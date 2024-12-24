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


const ConfirmModal = () => {
    const { isOpen, type, onClose, data } = useModal();

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
                    <AlertDialogCancel>Peruuta</AlertDialogCancel>
                    <AlertDialogAction onClick={() => data.callback()} className="bg-red-500 hover:bg-red-600 text-white">Kyllä, poista</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal;