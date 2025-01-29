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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createDocument, listDocuments, signInWithEmail, signUpWithEmail, updateDocument } from "@/lib/appwrite/server/appwrite";
import { mauticEmailService } from "@/lib/mautic/mautic";

export default function Page() {

   const router = useRouter();
   const searchParams = useSearchParams();
   const ref = searchParams.get('ref');

   const [errorMessage, setErrorMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const { register, handleSubmit, formState: { errors } } = useForm();

   const handleRegister = async (formData) => {

      if (formData.password.length < 8) {
         setErrorMessage("Salasanan on oltava vähintään 8 merkkiä pitkä.");
         return;
      }

      setErrorMessage("");
      setIsLoading(true);

      try {
         const newUserId = await signUpWithEmail(formData.email, formData.password, `${formData.first_name} ${formData.last_name}`);

         if (newUserId) {
            await signInWithEmail(formData.email, formData.password);
            const base64 = Buffer.from(formData.email).toString('base64');

            const u = await createDocument("main_db", "profiles", {
               document_id: newUserId,
               body: {
                  email: formData.email,
                  name: `${formData.first_name} ${formData.last_name}`,
                  referal_code: base64.slice(0, 8)
               }
            });

            await mauticEmailService.handleUserAuthentication(formData.email, { name: `${formData.first_name} ${formData.last_name}` });

            if (ref) {
               const inviteExists = await listDocuments("main_db", "invited_users", [{ type: "equal", name: "invited_email", value: formData.email }]);
               console.log(inviteExists)
               console.log(inviteExists.documents[0].$id)
               if (inviteExists.total > 0) {
                  await updateDocument("main_db", "invited_users", inviteExists.documents[0].$id, {
                     status: "registered"
                  });
               }
            }
            router.push("/dashboard/account/profile");
         }
      } catch (error) {
         setErrorMessage(error.message);
         console.log(error);
         return;
      } finally {
         setIsLoading(false);
      }

      // router.push("/dashboard");
   };


   return (
      <div className="flex h-screen w-full items-center justify-center px-4 bg-indigo-50">
         <Card className="mx-auto w-full max-w-md shadow-xl">
            <CardHeader>
               <CardTitle className="text-2xl font-semibold text-center">Rekisteröidy</CardTitle>
               <CardDescription className="text-center">tai <Link href={"/login" + (ref ? `?ref=${ref}` : "")} className="text-indigo-500 font-semibold">kirjaudu sisään</Link></CardDescription>
            </CardHeader>
            <CardContent>

               <form onSubmit={handleSubmit(handleRegister)} className="grid">
                  {errorMessage && <p className="text-sm text-center -mt-2 mb-3 text-red-500">{errorMessage}</p>}
                  <div className="grid gap-1 mb-3">
                     <Label htmlFor="first_name">Etunimi</Label>
                     <Input
                        id="first_name"
                        type="text"
                        className="shadow-sm"
                        {...register("first_name", { required: "Etunimi on pakollinen" })}
                     />
                     {errors.first_name && <p className="text-red-500 text-sm -mt-1">{errors.first_name.message}</p>}
                  </div>
                  <div className="grid gap-1 mb-3">
                     <Label htmlFor="last_name">Sukunimi</Label>
                     <Input
                        id="last_name"
                        type="text"
                        className="shadow-sm"
                        {...register("last_name", { required: "Sukunimi on pakollinen" })}
                     />
                     {errors.last_name && <p className="text-red-500 text-sm -mt-1">{errors.last_name.message}</p>}
                  </div>
                  <div className="grid gap-1 mb-3">
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
                  <div className="grid gap-1">
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
                  {/* <Link href="/reset-password" className="text-indigo-500 font-semibold text-sm mt-2">
                     Unohditko salasanasi?
                  </Link> */}
                  <Button
                     type="submit"
                     className="w-full mt-6"
                     disabled={isLoading}
                  >
                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Rekisteröidy"}
                  </Button>
                  {/* <Button
                     type="button"
                     variant="outline"
                     className="w-full mt-3 hover:bg-transparent border border-indigo-500 text-indigo-500 hover:text-indigo-700 hover:border-indigo-700"
                  >
                     <span className="font-medium ">Jatka Google-tilillä</span>
                     <img src="/google.svg" className="w-5 h-5" />
                  </Button> */}
               </form>
            </CardContent>
         </Card>
      </div>
   );
}