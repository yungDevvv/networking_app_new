import MemberCard from "@/components/member-card";
import { getDocument, getLoggedInUser, getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite";
import { getTranslations } from 'next-intl/server';
import Actions from "./actions";

export default async function Page({ params }) {
   const user = await getLoggedInUserProfile();
   const t = await getTranslations();

   const { networkId } = await params;

   try {
      const currentNetwork = await getDocument("main_db", "networks", networkId);

      if (!currentNetwork) {
         return (
            <div className="w-full flex items-center justify-center p-8">
               <h2 className="text-xl text-gray-700">{t("network_not_found")}</h2>
            </div>
         )
      }

      const currentMember = currentNetwork?.members.find(member => member.profiles.$id === user.$id);

      if (currentMember === undefined) {
         return (
            <div className="w-full flex items-center justify-center p-8">
               <h2 className="text-xl text-gray-700">{t("you_are_not_a_member")}</h2>
            </div>
         )
      }

      const members = currentNetwork.members.filter(member => member.profiles.$id !== user.$id);

      const getUserProfile = async (id) => {
         try {
            const profile = await getDocument("main_db", "profiles", id);

            return profile;
         } catch (error) {
            console.log(error);
            return null
         }
      }

      try {

         const memberCards = await Promise.all(members.map(async (member) => {
            const memberProfile = await getUserProfile(member.profiles.$id);

            const meets = memberProfile?.meets?.filter(meet => meet.sender_id === user.$id) || [];

            return <MemberCard key={member.$id} member={member} meets={meets} memberProfile={memberProfile} currentUser={user} />;
         }));

         return (
            <div>
               <div className="flex items-center justify-between py-5">
                  <div>
                     <h2 className="text-2xl font-semibold text-gray-900">
                        {currentNetwork.name}
                     </h2>
                     <p className="mt-2 text-gray-600 mr-20">
                        {currentNetwork.description}
                     </p>
                  </div>
                  <Actions network={currentNetwork} networkId={networkId} user={currentMember} />
               </div>

               <div className="my-5">
                  <h4 className="font-semibold mb-3">{t("members")}</h4>
                  <div className="grid grid-cols-3 max-2xl:grid-cols-2 max-[1100px]:grid-cols-1 gap-3">
                     {members.length !== 0
                        ? memberCards
                        : <h3>{t("you_are_only_participant")}</h3>
                     }
                  </div>
               </div>
            </div>
         )
      } catch (error) {
         console.log("Error loading member profiles:", error);
         return (
            <div className="w-full flex items-center justify-center p-8">
               <h2 className="text-xl text-gray-700">Error loading member profiles</h2>
            </div>
         )
      }
   } catch (error) {
      console.log(error)
      return (
         <div className="w-full flex items-center justify-center p-8">
            <h2 className="text-xl text-gray-700">Network not found</h2>
         </div>
      )
   }
}
