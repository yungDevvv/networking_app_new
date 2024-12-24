"use client";

import { useModal } from "@/hooks/use-modal";
import { useEffect } from "react";

export default function ServerSideModalOpenerButton({ children, type, className }) {
    const { onOpen, type: typeTest, isOpen } = useModal();
    
    return (
        <div onClick={() => {
            onOpen(type)
          
        }} className={className}>
            {children}
        </div>
    );
}