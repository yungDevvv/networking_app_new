"use client"

import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import WeekSearchItem from "@/components/week-search/week-search-item";
import WeekSearchFilters from "@/components/week-search/week-search-filters";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useDocuments } from "@/hooks/use-documents";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { businessCategories } from "@/types/business-categories";

export default function Page() {
   const [filteredSearches, setFilteredSearches] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [activeFilters, setActiveFilters] = useState({
      location: 'all',
      timeRange: 'all',
      category: 'all'
   });

   const router = useRouter();
   const user = useUser();
   const t = useTranslations();

   const { documents, mutate, isLoading } = useDocuments(
      "main_db",
      "week_searches",
      [{ type: "equal", name: "is_active", value: true }]
   );

   const handleSearch = useCallback((term) => {
      setSearchTerm(term);
   }, []);

   // Calculate category counts
   const categoryStats = useMemo(() => {
      if (!documents) return {};

      const stats = {};
      documents.forEach(doc => {
         if (doc.categories && Array.isArray(doc.categories)) {
            doc.categories.forEach(category => {
               stats[category] = (stats[category] || 0) + 1;
            });
         }
      });

      return stats;
   }, [documents]);

   // Combined search and filter function
   const filterAndSearchDocuments = useMemo(() => {
      if (!documents) return [];

      let results = [...documents];

      if (searchTerm) {
         const searchLower = searchTerm.toLowerCase();
         results = results.filter(doc => {
            const searchableFields = [
               doc.text,
               doc.profiles?.name,
               doc.profiles?.companies?.name,
               doc.profiles?.location
            ].filter(Boolean);

            return searchableFields.some(field =>
               field.toLowerCase().includes(searchLower)
            );
         });
      }

      // Apply location filter
      if (activeFilters.location !== 'all') {
         results = results.filter(doc =>
            doc.profiles?.location?.toLowerCase() === activeFilters.location.toLowerCase()
         );
      }

      // Apply category filter
      if (activeFilters.category !== 'all') {
         results = results.filter(doc =>
            doc.categories?.includes(activeFilters.category)
         );
      }

      // Apply time range filter
      if (activeFilters.timeRange !== 'all') {
         const now = new Date();
         const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
         const startOfWeek = new Date(today);
         startOfWeek.setDate(today.getDate() - today.getDay());
         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

         results = results.filter(doc => {
            const docDate = new Date(doc.$createdAt);

            switch (activeFilters.timeRange) {
               case 'today':
                  return docDate >= today;
               case 'week':
                  return docDate >= startOfWeek;
               case 'month':
                  return docDate >= startOfMonth;
               default:
                  return true;
            }
         });
      }

      return results;
   }, [documents, searchTerm, activeFilters]);

   useEffect(() => {
      setFilteredSearches(filterAndSearchDocuments);
   }, [filterAndSearchDocuments]);

   if (!user) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-6 w-6 animate-spin" />
         </div>
      );
   }

   return (
      <div className="max-w-5xl mx-auto px-4 py-8 max-md:py-0 max-xl:!px-0 max-xl:mx-0 max-xl:!max-w-[100%]">
         <div className="flex items-center max-md:flex-wrap justify-between mb-6">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900 max-md:text-xl">{t("weekly_searches")}</h1>
               <p className="text-sm text-gray-500 mt-1 max-w-md">
                  {t("weekly_searches_description")}
               </p>
            </div>
            <Button className="flex items-center gap-2 max-md:w-full max-md:mt-4 ml-5 max-md:ml-0" onClick={() => router.push("/dashboard/week-searches/my")}>
               <Plus className="h-4 w-4" />
               <span>{t("new_search")}</span>
            </Button>
         </div>

         <div className="grid grid-cols-[1fr_300px] max-lg:grid-cols-1 gap-8 max-lg:gap-5">
            <div className="space-y-4">
               <WeekSearchFilters
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  onSearch={handleSearch}
                  onFilter={setActiveFilters}
               />
               {isLoading ? (
                  <div className="w-full flex items-center justify-center">
                     <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                  </div>
               ) : filteredSearches.length > 0 ? (
                  <div className="space-y-4">
                     {filteredSearches.map((weekSearch) => (
                        <WeekSearchItem
                           key={weekSearch.$id}
                           weekSearch={weekSearch}
                           mutate={mutate}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8">
                     <Search className="h-8 w-8 mx-auto text-gray-400" />
                     <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {t("no_searches_found")}
                     </h3>
                     <p className="mt-1 text-sm text-gray-500">
                        {t("adjust_search")}
                     </p>
                  </div>
               )}
            </div>

            <div className="lg:sticky lg:top-8 max-lg:order-first">
               <div className="rounded-xl border border-gray-200 p-4 bg-white">
                  <h3 className="font-medium text-gray-900 mb-3">{t("popular_categories")}</h3>
                  <div className="flex flex-col gap-2">
                     {isLoading ? (
                        <div className="w-full flex items-center justify-center">
                           <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                        </div>
                     ) : businessCategories
                        .filter(category => categoryStats[category] > 0)
                        .map((category) => (
                           <div
                              key={category}
                              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                           >
                              <span className="text-sm text-gray-600">{t(category)}</span>
                              <span className="text-xs font-medium text-gray-400">
                                 {categoryStats[category] >= 10 ? categoryStats[category] : "< 10"}
                              </span>
                           </div>
                        ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
