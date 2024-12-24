import SettingsSidebar from "@/components/sidebar/settings-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Settings } from "lucide-react";

export default function ProfileLayout({ children }) {
    return (
        <div className="w-full flex items-start">
            <SettingsSidebar />
            {children}
            <Toaster />
        </div>
    )
}