import SettingsSidebar from "@/components/sidebar/settings-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Settings } from "lucide-react";

export default function ProfileLayout({ children }) {
    return (
        <div className="w-full flex items-start max-w-7xl mx-auto max-sm:flex-wrap">
            <SettingsSidebar />
            {children}
            <Toaster />
        </div>
    )
}