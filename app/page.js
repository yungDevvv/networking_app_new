// src/app/page.jsx

import { getLoggedInUser } from "@/lib/appwrite/server/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();
  console.log(user)
  // if (!user) redirect("/signup");
  // console.log(user)
  // redirect("/dashboard");
}
