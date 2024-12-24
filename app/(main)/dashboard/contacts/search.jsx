"use client"

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ContactPageSearch({ onSearch }) {

    const t = useTranslations();
    const handleSearch = debounce((e) => {
        onSearch(e.target.value);
    }, 300);

    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-md:w-full">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    className="pl-10 !mt-0 max-md:text-sm"
                    placeholder={t("search_contacts")}
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}   