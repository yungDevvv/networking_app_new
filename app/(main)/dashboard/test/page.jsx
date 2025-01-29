"use server"

import { listDocuments } from "@/lib/appwrite/server/appwrite";

export default async function Page() {
    const documents = await listDocuments("main_db", "week_searches", []);
    // TODO: try to load every profile in отдельно с select где будут только те поля которые нужны
    return <div></div>;
}