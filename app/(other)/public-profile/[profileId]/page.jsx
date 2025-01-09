import { getDocument } from "@/lib/appwrite/server/appwrite";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }) {
    const { profileId } = await params;

    const t = await getTranslations();

    const profile = await getDocument("main_db", "profiles", profileId);

    if (profile.public_profile_visibility === false) return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="p-6 sm:flex sm:justify-between sm:items-center">
                <div className="flex items-center">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img src={"/blank_profile.png"} className='object-cover' />
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-semibold text-gray-900">{t("public_profile_hidden")}</h2>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className=" max-w-[60%] bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-60 overflow-hidden">
                    <img src={"/bg_image.jpg"} className="object-cover" />
                </div>
                <div className="p-6 sm:flex sm:justify-between sm:items-center">
                    <div className="flex items-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img src={"/blank_profile.png"} className='object-cover' />
                        </div>
                        <div className="ml-6">
                            <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>

                            <p className="text-gray-400 font-semibold">{profile?.job_title}</p>

                            <p className="text-indigo-500 font-semibold">RespaSolutions Oy</p>
                            {/* {profile?.company?.company_logo && <img className="w-[100px] h-[50px] object-contain" src={profile.company.company_logo} />} */}
                            <p className=" text-gray-600">{profile?.address}</p>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                        <a href={`mailto:${profile?.email}`} className="block text-blue-500 hover:underline">
                            {profile?.email}
                        </a>

                        <p className="text-gray-600">
                            {profile?.phone}
                        </p>

                        <a className="text-blue-500 hover:underline">
                            {profile?.website}
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
                    <h3 className="text-lg font-medium text-gray-900">Esittely</h3>
                    <p className="mt-2 text-gray-700">{profile?.introduction}</p>
                </div>

                <div className="p-6 border-t border-gray-200 sm:flex sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-medium text-gray-900">Etsitään</h4>
                        <p className="mt-2 text-gray-700">{profile?.searching}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-900">Tarjotaan</h4>
                        <p className="mt-2 text-gray-700">{profile?.offering}</p>
                    </div>
                </div>
            </div>
        </div>

    );
}