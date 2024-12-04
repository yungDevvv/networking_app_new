"use client"

import ContactCard from "@/components/contact-card";

export default function Page({ }) {


   return (
      <div className="w-full">
         <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Kontaktit</h1>
            <div className="relative flex items-center shadow-md">
               <input className="py-2 px-3 border border-indigo-50" type="text" placeholder={"Etsii" + "..."} />
               <button type="button" className="text-white h-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <svg className="bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 16 16">
                     <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
               </button>
            </div>
         </div>
         <div className="mx-auto py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
               {/* {results.length !== 0
                  ? results.map((member, i) => <ContactCard key={i} member={member} searchTerm={searchTerm} />)
                  : <h3>No users</h3>
               } */}
               <ContactCard />
               <ContactCard />
               <ContactCard />
               <ContactCard />
               <ContactCard />
            </div>
         </div>
      </div>
   );
}