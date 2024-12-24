"use client";

import ProfileWeekSearchItem from "@/components/week-search/profile-week-search-item";
import { storage } from "@/lib/appwrite/client/appwrite";
import { useUser } from "@/context/user-context";
import { businessNetworksType } from "@/types/business-networks-type";
import { useTranslations } from "next-intl";

export default function Dashboard({ weekSearches }) {
    const user = useUser();
    const t = useTranslations();

    const businessNetworks = user.business_networks
        ? businessNetworksType.filter(el => user.business_networks.find(bns => bns === el.name))
        : [];

    return (
        <div className="w-full flex items-start max-xl:flex-wrap gap-3 pb-4">
            <div className="w-[60%] max-xl:w-full bg-white shadow-md rounded-lg">
                <div className="h-60 max-md:h-50 overflow-hidden">
                    <img src={"/bg_image.jpg"} className="object-cover h-full w-full" />
                </div>
                <div className="p-6 max-md:p-3">
                    <div className="flex items-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img src={user?.avatar ? storage.getFilePreview("avatars", user.avatar) : "/blank_profile.png"} className='object-cover w-full h-full' />
                        </div>
                        <div className="ml-6">
                            <h2 className="text-2xl max-md:text-lg font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-400 max-md:text-sm font-medium">{user.job_title}</p>
                            <p className="text-indigo-500 max-md:text-sm font-medium">{user.companies.name}</p>
                            <p className=" text-gray-600 max-md:text-sm">{user.address}</p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col">

                        <a href={`mailto:sem.elmlm@gmail.com`} className="inline-block text-blue-500 hover:underline">
                            {user.email}
                        </a>
                        <p className="text-gray-600">{user.phone}</p>

                        <a className="text-blue-500 hover:underline">
                            {user.website}
                        </a>
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-5 mb-5">
                    {
                        businessNetworks.length !== 0 &&
                        businessNetworks.map((el, i) => <img key={i} className='w-[45px] h-[45px]' src={el.image} alt="network_logo" title={el.name} />)
                    }
                </div>
                <div className="p-6 max-md:p-3 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{t("introduction")}</h3>
                    <p className="mt-2 text-gray-700">{user.introduction}</p>
                </div>

                <div className="p-6 max-md:p-3 border-t border-gray-200 sm:flex sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-medium text-gray-900">{t("searching")}</h4>
                        <p className="mt-2 text-gray-700">{user.searching}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-900">{t("offering")}</h4>
                        <p className="mt-2 text-gray-700">{user.offering}</p>
                    </div>
                </div>
            </div>
            <div className="w-[40%] max-xl:w-full space-y-2 h-full">
                {weekSearches
                    ? weekSearches.map(week_search => <ProfileWeekSearchItem key={week_search.$id} weekSearch={week_search} />)
                    : t("no_week_searches_found")
                }
            </div>
        </div>
    )
};

