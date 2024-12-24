import MemberCard from "@/components/member-card";
import { getDocument, getLoggedInUser } from "@/lib/appwrite/server/appwrite";
import { getTranslations } from 'next-intl/server';
import Actions from "./actions";

export default async function Page({ params }) {
    const user = await getLoggedInUser();
    const t = await getTranslations();
    const { groupId } = await params;

    try {
        const currentGroup = await getDocument("main_db", "groups", groupId);

        const currentMember = currentGroup.group_members.find(member => member.profiles.$id === user.$id);

        const group_members = currentGroup.group_members.filter(member => member.profiles.$id !== user.$id);

        return (
            <div>
                <div className="flex items-center justify-between py-5">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {currentGroup.name}
                        </h2>
                        <p className="mt-2 text-gray-600 mr-20">
                            {currentGroup.description}
                        </p>
                    </div>
                    <Actions group={currentGroup} user={currentMember}  />
                </div>

                <div className="my-5">
                    <h4 className="font-semibold mb-3">{t("members")}</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
                        {
                            group_members.length !== 0
                                ? group_members.map((member, i) => <MemberCard key={member.$id} member={member} />)
                                : <h3>{t("you_are_only_participant")}</h3>
                        }
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.log(error);
        return (
            <div className="w-full flex items-center justify-center p-8">
                <h2 className="text-xl text-gray-700">{t("group_not_found")}</h2>
            </div>
        )
    }
}
