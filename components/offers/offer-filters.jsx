"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { maakunnat } from "@/types/finnish-areas";
import { businessCategories } from "@/types/business-categories";

const OfferFilters = ({
    searchTerm,
    onSearch,
    activeFilters,
    setActiveFilters,
}) => {
    const t = useTranslations();
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setActiveFilters({
            location: 'all',
            timeRange: 'all',
            category: 'all'
        });
        onSearch('');
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-xs:w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t('search_in_offers')}
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-8 !mt-0"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2 text-gray-700 max-xs:w-full"
                >
                    <SlidersHorizontal className="h-4 w-4 text-gray-700" />
                    {t("filters")}
                </Button>
            </div>
            {showFilters && (
                <div className="flex flex-col space-y-4 p-4 rounded-lg bg-gray-50">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                {t("time_range")}
                            </label>
                            <Select
                                value={activeFilters.timeRange}
                                onValueChange={(value) => handleFilterChange('timeRange', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_time_range")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_time")}</SelectItem>
                                    <SelectItem value="today">{t("today")}</SelectItem>
                                    <SelectItem value="week">{t("this_week")}</SelectItem>
                                    <SelectItem value="month">{t("this_month")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                {t("location")}
                            </label>
                            <Select
                                value={activeFilters.location}
                                onValueChange={(value) => handleFilterChange('location', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_location")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_locations")}</SelectItem>
                                    {maakunnat.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-1.5 block text-gray-700">
                                {t("category")}
                            </label>
                            <Select
                                value={activeFilters.category}
                                onValueChange={(value) => handleFilterChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("select_category")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("all_categories")}</SelectItem>
                                    {businessCategories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {t(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            {t("clear_all")}
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default OfferFilters;
