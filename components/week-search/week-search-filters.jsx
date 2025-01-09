"use client"

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { debounce } from '@/lib/utils';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { businessCategories } from '@/types/business-categories';

const WeekSearchFilters = ({ onSearch, activeFilters, setActiveFilters }) => {
   const t = useTranslations();
   const [showFilters, setShowFilters] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');

   // Create debounced search function
   const debouncedSearch = useCallback(
      debounce((value) => onSearch(value), 300),
      [onSearch]
   );

   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
   };

   const handleFilterChange = (type, value) => {
      setActiveFilters(prev => ({ ...prev, [type]: value }));
   };

   const clearFilters = () => {
      setActiveFilters({
         timeRange: 'all',
         location: 'all',
         category: 'all'
      });
      setSearchTerm('');
      onSearch('');
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2 max-xs:flex-wrap">
            <div className="relative flex-1 max-xs:w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 !m-0 text-sm"
                  placeholder={t("search_in_week_searches")}
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
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-gray-50">
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
                        <SelectItem value="helsinki">{t("helsinki")}</SelectItem>
                        <SelectItem value="espoo">{t("espoo")}</SelectItem>
                        <SelectItem value="tampere">{t("tampere")}</SelectItem>
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
                        {businessCategories.map((category) => (
                           <SelectItem key={category} value={category}>
                              {t(category)}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-2 self-end"
               >
                  <X className="h-4 w-4" />
                  {t("clear_all")}
               </Button>
            </div>
         )}
      </div>
   );
};

export default WeekSearchFilters;
