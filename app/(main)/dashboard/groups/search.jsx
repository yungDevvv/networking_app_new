import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { debounce } from "@/lib/utils"
import { useTranslations } from "next-intl";

export default function GroupPageSearch({ onSearch }) {
    const t = useTranslations(); 

    const handleSearch = debounce((e) => {
        onSearch(e.target.value);
    }, 300);

    return (
        <div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    className="pl-10 !mt-0"
                    placeholder={t("search_groups")}
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
}
