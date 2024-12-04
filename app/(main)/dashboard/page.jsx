import ProfileWeekSearchItem from "@/components/week-search/profile-week-search-item";

export default async function Page() {

   // if(!user) return <div>NO USER</div>

   return (
      <div className="w-full h-full flex items-start flex-wrap">
         <div className="w-[60%] max-thousand:w-full max-h-screen bg-white shadow-md rounded-lg overflow-hidden">
            <div className="h-60 overflow-hidden">
               <img src={"/bg_image.jpg"} className="object-cover" />
            </div>
            <div className="p-6 sm:flex sm:justify-between sm:items-center">
               <div className="flex items-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                     <img src={"/blank_profile.png"} className='object-cover' />
                  </div>
                  <div className="ml-6">
                     <h2 className="text-2xl font-bold text-gray-900">Semen Meliachenko</h2>

                     <p className="text-gray-400 font-semibold">Software Engineer</p>

                     <p className="text-indigo-500 font-semibold">RespaSolutions Oy</p>
                     {/* {profile?.company?.company_logo && <img className="w-[100px] h-[50px] object-contain" src={profile.company.company_logo} />} */}
                     <p className=" text-gray-600">Palikkapolku 1</p>
                  </div>
               </div>

               <div className="mt-4 sm:mt-0">

                  <a href={`mailto:sem.elmlm@gmail.com`} className="block text-blue-500 hover:underline">
                     sem.elmlm@gmail.com
                  </a>


                  <p className="text-gray-600">0466204143</p>


                  <a className="text-blue-500 hover:underline">
                     www.google.com
                  </a>
               </div>
            </div>
            <div className="flex items-center space-x-2 ml-5 mb-5">
               {/* {
                     businessNetworks.length !== 0 &&
                     businessNetworks.map((el, i) => <img key={i} className='w-[45px] h-[45px]' src={el.image} alt="network_logo" title={el.name} />)
                  } */}
            </div>
            <div className="p-6 border-t border-gray-200">
               <h3 className="text-lg font-medium text-gray-900">Intro</h3>
               <p className="mt-2 text-gray-700">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae nobis aliquid ipsam et consequuntur explicabo quidem excepturi quasi, soluta doloremque consectetur illo pariatur dolorem placeat facere recusandae non nostrum assumenda.</p>
            </div>

            <div className="p-6 border-t border-gray-200 sm:flex sm:justify-between">
               <div className="mb-4 sm:mb-0">
                  <h4 className="text-lg font-medium text-gray-900">Etsitään</h4>
                  <p className="mt-2 text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque perferendis dignissimos itaque nulla voluptatem voluptates repellendus ab. Voluptatem, repellat accusantium, voluptatum blanditiis, quidem harum quod recusandae dolor consequuntur tempora cum!</p>
               </div>
               <div>
                  <h4 className="text-lg font-medium text-gray-900">Tarjotaan</h4>
                  <p className="mt-2 text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et laborum possimus laboriosam! Officiis labore autem quaerat neque non. Consequuntur recusandae a sed quasi aliquid error, animi doloremque odio harum iste?</p>
               </div>
            </div>
         </div>
         <div className="w-[40%] pl-3 max-thousand:w-full max-thousand:px-0">
            <ProfileWeekSearchItem />
            <ProfileWeekSearchItem />
            <ProfileWeekSearchItem />
            <ProfileWeekSearchItem />
            {/* {weekSearches.length !== 0
                  ? weekSearches.map(weekSearch => <ProfileWeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
                  : "No week searches"
               } */}
         </div>
         {/* <ToastContainer /> */}
      </div>
   )
}