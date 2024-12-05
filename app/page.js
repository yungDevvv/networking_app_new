import { getLoggedInUser } from "@/lib/appwrite/server/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  console.log(await getLoggedInUser())
  // return redirect("/dashboard"); 
}
