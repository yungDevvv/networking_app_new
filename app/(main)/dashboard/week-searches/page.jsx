"use client"

import { Fragment, useEffect, useState } from "react";
import { Search } from "lucide-react";
import WeekSearchItem from "@/components/week-search/week-search-item";

export default function Page() {
   const [weekSearches, setWeekSearches] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');

   const handleChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const [filter, setFilter] = useState('');

   const handleFilterChange = (e) => {
      setFilter(e.target.value);
   };


   return (
      <Fragment> 
         <div className="flex items-start justify-center">
            <div className="max-w-[850px] w-full">
               <div className="w-full">
                  {/* {weekSearches.length !== 0
                     ? weekSearches.map(weekSearch => <WeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
                     : "No week searches"
                  } */}
                <WeekSearchItem />
                <WeekSearchItem />
                <WeekSearchItem />

                <WeekSearchItem />
                <WeekSearchItem />

                     
               </div>
            </div>
            <div className="max-w-[250px] mt-3 ml-4 border border-indigo-200 p-3 rounded-md h-max">
               <div className="relative flex items-center shadow-md">
                  <input onChange={(e) => handleChange(e)} className="py-2 px-3 border border-indigo-50" type="text" placeholder={"Etsii" + "..."} />
               </div>
               <label className="flex items-center p-2 mt-3 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value=""
                     // checked={filter === ''}
                     // onChange={handleFilterChange}
                     className="mr-2"
                  />
                  Koko aikana
               </label>
               <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="thisWeek"
                     // checked={filter === 'thisWeek'}
                     // onChange={handleFilterChange}
                     className="mr-2"
                  />
                  Tällä viikolla
               </label>
               <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="twoWeeks"
                     // checked={filter === 'twoWeeks'}
                     // onChange={handleFilterChange}
                     className="mr-2"
                  />
                  Viimeiset kaksi viikkoa
               </label>
               <label className="flex items-center mb-3 p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="thisMonth"
                     // checked={filter === 'thisMonth'}
                     // onChange={handleFilterChange}
                     className="mr-2"
                  />
                  Tämä kuukausi
               </label>

               <button onClick={() => handleSearch()} type="button" className="flex rounded justify-center text-white h-full w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <Search size={18} className="mr-2" />
                  <span className="">Etsii</span>
               </button>
            </div>
         </div>
      </Fragment>

   )
}


