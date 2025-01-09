import { getLoggedInUser, getLoggedInUserProfile, listDocuments } from "@/lib/appwrite/server/appwrite";
import { getTranslations, getLocale } from "next-intl/server";
import MeetingsList from "@/components/meetings/meetings-list";

export default async function Page() {
    const user = await getLoggedInUserProfile();
    const t = await getTranslations();
    const userMeets = await listDocuments("main_db", "meets", [{ type: "equal", name: "sender_id", value: user.$id }]);
    const locale = await getLocale();

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-8 max-md:text-xl">{t("meetings")}</h1>
            <MeetingsList meetings={userMeets.documents} locale={locale} />
        </div>
    );
}