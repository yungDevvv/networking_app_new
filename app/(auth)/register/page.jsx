"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   CardFooter
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { account, ID } from "@/lib/appwrite/client/appwrite";

export default function Page({ }) {
   const supabase = createClient();

   const router = useRouter();

   const [errorMessage, setErrorMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const { register, handleSubmit, formState: { errors } } = useForm();

   const handleRegister = async (formData) => {
      setErrorMessage("");
      setIsLoading(true);
      try {
         const res = await account.create(ID.unique(), formData.email, formData.password);
         console.log(res)
      } catch (error) {
         alert(error);
         setErrorMessage(error);
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      // (async () => {
      //    const { data: initUser, error: initUserError } = await supabase.auth.getUser();

      //    if (initUserError) console.error(initUserError);

      //    if (initUser.user) {
      //       const { data: user, error: userError } = await supabase
      //          .from("users")
      //          .select("active_event")
      //          .eq("id", initUser.user.id);

      //       if (userError) console.error(userError);

      //       if (user[0]) {
      //          router.push("/");
      //       }
      //    }
      // })()

   }, [])

   return (
      <div className="flex h-screen w-full items-center justify-center px-4 bg-indigo-50">
         <Card className="mx-auto w-full max-w-md shadow-xl">
            <CardHeader>
               <CardTitle className="text-3xl font-semibold text-center">Rekisteröidy</CardTitle>
               <CardDescription className="text-center">tai <Link href="/login" className="text-indigo-500 font-semibold">kirjaudu sisään</Link></CardDescription>
            </CardHeader>
            <CardContent>

               <form onSubmit={handleSubmit(handleRegister)} className="grid">
                  {errorMessage && <p className="text-sm -my-2 text-red-500">{errorMessage}</p>}
                  {/* <div className="grid gap-2 mb-5">
                     <Label htmlFor="first_name">Etunimi</Label>
                     <Input
                        id="first_name"
                        type="text"
                        className="shadow-sm"
                        {...register("first_name", { required: "Etunimi on pakollinen" })}
                     />
                     {errors.first_name && <p className="text-red-500 text-sm -mt-1">{errors.first_name.message}</p>}
                  </div>
                  <div className="grid gap-2 mb-5">
                     <Label htmlFor="last_name">Sukunimi</Label>
                     <Input
                        id="last_name"
                        type="text"
                        className="shadow-sm"
                        {...register("last_name", { required: "Sukunimi on pakollinen" })}
                     />
                     {errors.last_name && <p className="text-red-500 text-sm -mt-1">{errors.last_name.message}</p>}
                  </div> */}
                  <div className="grid gap-2 mb-5">
                     <Label htmlFor="email">Sähköposti</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="shadow-sm"
                        {...register("email", { required: "Sähköposti on pakollinen" })}
                     />
                     {errors.email && <p className="text-red-500 text-sm -mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center">
                        <Label htmlFor="password">Salasana</Label>
                        {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                  Unohditko salasanasi?
                </Link> */}
                     </div>
                     <Input
                        id="password"
                        type="password"
                        className="shadow-sm"
                        {...register("password", { required: "Salasana on pakollinen" })}
                     />
                     {errors.password && <p className="text-red-500 text-sm -mt-1">{errors.password.message}</p>}
                  </div>
                  <Link href="/reset-password" className="text-indigo-500 font-semibold text-sm mt-2">
                     Unohditko salasanasi?
                  </Link>
                  <Button
                     type="submit"
                     className="w-full mt-6"
                     disabled={isLoading}
                  >
                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Rekisteröidy"}
                  </Button>
                  <Button
                     type="button"
                     variant="outline"
                     className="w-full mt-3 hover:bg-transparent border border-indigo-500 text-indigo-500 hover:text-indigo-700 hover:border-indigo-700"
                  >
                     <span className="font-medium ">Jatka Google-tilillä</span>
                     <img src="/google.svg" className="w-5 h-5" />
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}