"use client"
import { Fragment, useEffect, useState } from "react";
import WeekSearchItem from "@/components/week-search/week-search-item";
import WeekSearchFilters from "@/components/week-search/week-search-filters";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useDocuments } from "@/hooks/use-documents";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

export default function Page() {
   const [filteredSearches, setFilteredSearches] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [activeFilters, setActiveFilters] = useState({
      location: 'all',
      timeRange: 'all'
   });

   const router = useRouter();

   const { documents, mutate, isLoading } = useDocuments("main_db", "week_searches");
   const t = useTranslations();

   // Combined search and filter function
   const filterAndSearchDocuments = (docs, term, filters) => {
      if (!docs) return [];

      let results = [...docs];

      if (term) {
         const searchLower = term.toLowerCase();
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
      if (filters.location !== 'all') {
         results = results.filter(doc =>
            doc.profiles?.location?.toLowerCase() === filters.location.toLowerCase()
         );
      }

      // Apply time range filter
      if (filters.timeRange !== 'all') {
         const now = new Date();
         let startDate = new Date();

         switch (filters.timeRange) {
            case 'today':
               startDate.setHours(0, 0, 0, 0);
               break;
            case 'week':
               startDate.setDate(now.getDate() - 7);
               break;
            case 'month':
               startDate.setMonth(now.getMonth() - 1);
               break;
         }

         results = results.filter(doc => {
            const docDate = new Date(doc.$createdAt);
            return docDate >= startDate;
         });
      }

      return results;
   };

   const handleSearch = (term) => {
      setSearchTerm(term);
      setFilteredSearches(filterAndSearchDocuments(documents, term, activeFilters));
   };

   const handleFilter = (filters) => {
      setActiveFilters(filters);
      setFilteredSearches(filterAndSearchDocuments(documents, searchTerm, filters));
   };

   // Initial load and when documents change
   useEffect(() => {
      if (documents) {
         setFilteredSearches(filterAndSearchDocuments(documents, searchTerm, activeFilters));
      }
   }, [documents]);

   return (
      <div className="max-w-5xl mx-auto px-4 py-8 max-xl:!px-0 max-xl:mx-0 max-xl:!max-w-[100%]" >
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900">{t("weekly_searches")}</h1>
               <p className="text-sm text-gray-500 mt-1 max-w-md">
                  {t("weekly_searches_description")}
               </p>
            </div>
            <Button className="flex items-center gap-2 ">
               <Plus className="h-4 w-4" />
               <span>New Search</span>
            </Button>
         </div>

         <div className="grid grid-cols-[1fr_300px] max-lg:grid-cols-1 gap-8 max-lg:gap-5">
            <div className="space-y-4">
               <WeekSearchFilters onSearch={handleSearch} onFilter={handleFilter} />
               {isLoading && (
                  <div className="w-full flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-indigo-500" /></div>
               )}

               {!isLoading && documents && documents.length === 0 && (
                  <div className="text-center py-12">
                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                     </div>
                     <h3 className="text-sm font-medium text-gray-900">No searches found</h3>
                     <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or filter criteria
                     </p>
                  </div>
               )}

               {!isLoading && filteredSearches && filteredSearches.length === 0 && (
                  <div className="text-center py-12">
                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                     </div>
                     <h3 className="text-sm font-medium text-gray-900">No searches found</h3>
                  </div>
               )}

               {filteredSearches && filteredSearches.length > 0 && (
                  <div className="space-y-4">
                     {filteredSearches.map((search, index) => (
                        <WeekSearchItem key={index} weekSearch={search} router={router} mutate={mutate} />
                     ))}
                  </div>
               )}
            </div>

            <div className="lg:sticky lg:top-8 max-lg:order-first">
               <div className="rounded-xl border border-gray-200 p-4 bg-white">
                  <h3 className="font-medium text-gray-900 mb-3">{t("popular_categories")}</h3>
                  <div className="grid max-lg:grid-cols-4 lg:grid-cols-1 gap-2 max-sm:grid-cols-2">
                     {['Business', 'Technology', 'Marketing', 'Design'].map((category) => (
                        <div
                           key={category}
                           className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                        >
                           <span className="text-sm text-gray-600">{category}</span>
                           <span className="text-xs font-medium text-gray-400">24</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
