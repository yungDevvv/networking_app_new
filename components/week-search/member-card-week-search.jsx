"use client"

import { Calendar, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MemberCardWeekSearch = ({ member }) => {

   const t = useTranslations(); 

   const filteredWeekSearches = member.week_searches.length !== 0 ? member.week_searches.reverse() : [];

   return (
      <div className="space-y-2">
         <div className="space-y-3">
            {member.week_searches.length !== 0
               ? member.week_searches.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-all">
                     <div className="flex items-start gap-3">
                        <div className="shrink-0">
                           <div className="bg-indigo-50 rounded-lg p-2">
                              <Calendar className="h-4 w-4 text-indigo-600" />
                           </div>
                        </div>
                        <div className="min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-indigo-600">{item.date}</span>
                              <div className="h-1 w-1 rounded-full bg-gray-300" />
                              <span className="text-xs text-gray-500">Weekly Search</span>
                           </div>
                           <p className="text-sm text-gray-700 leading-thin">
                              {item.search}
                           </p>
                        </div>
                     </div>
                  </div>
               ))
               : <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <div className="bg-white rounded-full p-3 mb-4 border border-gray-200 shadow-sm">
                     <Search className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{t("no_week_searches_found")}</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                     {t("no_week_searches_description")}
                  </p>
               </div>
            }
         </div>
      </div>
   );
};

export default MemberCardWeekSearch;