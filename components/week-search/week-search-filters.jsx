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

const WeekSearchFilters = ({ onSearch, onFilter }) => {
   const t = useTranslations();
   const [showFilters, setShowFilters] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedFilters, setSelectedFilters] = useState({
      timeRange: 'all',
      location: 'all',
      category: 'all'
   });

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
      const newFilters = { ...selectedFilters, [type]: value };
      setSelectedFilters(newFilters);
      onFilter(newFilters);
   };

   const clearFilters = () => {
      setSelectedFilters({
         timeRange: 'all',
         location: 'all',
         category: 'all'
      });
      onFilter({
         timeRange: 'all',
         location: 'all',
         category: 'all'
      });
   };

   return (
      <div className="sticky top-0 bg-white z-10 pb-4 space-y-4">
         <div className="flex items-center gap-2">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
               <Input
                  type="text"
                  placeholder={t("search_in_week_searches")}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 w-full"
               />
            </div>
            <Button
               variant="outline"
               size="icon"
               onClick={() => setShowFilters(!showFilters)}
               className={showFilters ? 'bg-indigo-50 text-indigo-600 -mb-1' : '-mb-1'}
            >
               <SlidersHorizontal className="h-4 w-4" />
            </Button>
         </div>

         {showFilters && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{t("filters")}</h3>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={clearFilters}
                     className="h-8 text-gray-600 hover:text-gray-900"
                  >
                     <X className="h-4 w-4 mr-1" />
                     {t("clear_all")}
                  </Button>
               </div>

               <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">{t("time_range")}</label>
                     <Select
                        value={selectedFilters.timeRange}
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

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">{t("location")}</label>
                     <Select
                        value={selectedFilters.location}
                        onValueChange={(value) => handleFilterChange('location', value)}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder={t("select_location")} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">{t("all_locations")}</SelectItem>
                           <SelectItem value="helsinki">Helsinki</SelectItem>
                           <SelectItem value="espoo">Espoo</SelectItem>
                           <SelectItem value="tampere">Tampere</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700">{t("category")}</label>
                     <Select
                        value={selectedFilters.category}
                        onValueChange={(value) => handleFilterChange('category', value)}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder={t("select_category")} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">{t("all_categories")}</SelectItem>
                           <SelectItem value="business">{t("business")}</SelectItem>
                           <SelectItem value="technology">{t("technology")}</SelectItem>
                           <SelectItem value="marketing">{t("marketing")}</SelectItem>
                           <SelectItem value="design">{t("design")}</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default WeekSearchFilters;
