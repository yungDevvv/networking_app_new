import { listDocuments } from "@/lib/appwrite/server/appwrite";
import Dashboard from "./dashboard";

export default async function Page() {
   const { documents } = await listDocuments("main_db", "week_searches", [{ type: "limit", value: 5 }]);

   return <Dashboard weekSearches={documents} />;
}
