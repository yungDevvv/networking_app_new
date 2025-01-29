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
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { signInWithEmail } from "@/lib/appwrite/server/appwrite";

export default function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (formData) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      await signInWithEmail(formData.email, formData.password);

    } catch (error) {
      console.log(error.message, "ASDASDASDASD")
      if (error.message === "Invalid credentials. Please check the email and password.") {
        setErrorMessage("Virheelliset tunnukset. Tarkista sähköposti ja salasana.")
      };
      if (error.message === "Invalid `password` param: Password must be between 8 and 256 characters long.") {
        setErrorMessage("Salasanan on oltava 8-256 merkkiä pitkä.")
      }
      console.log(error)
    } finally {
      setIsLoading(false);
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-indigo-50">
      <Card className="mx-auto w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Kirjaudu sisään</CardTitle>
          <CardDescription className="text-center">tai <Link href={"/register" + (ref ? `?ref=${ref}` : "")} className="text-indigo-500 font-semibold">luo uusi tili</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="grid">
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <div className="grid gap-1 mb-5">
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="shadow-sm"
                {...register("email", { required: "Sähköposti on pakollinen" })}
              />
              {errors.email && <p className="text-red-500 text-sm my-2">{errors.email.message} sssss</p>}
            </div>
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Salasana</Label>
              </div>
              <Input
                id="password"
                type="password"
                className="shadow-sm"
                {...register("password", { required: "Salasana on pakollinen" })}
              />
              {errors.password && <p className="text-red-500 text-sm -mt-1">{errors.password.message}</p>}
            </div>
            <Link href="/forgot-password" className="text-indigo-500 font-semibold mt-2 text-sm hover:text-indigo-700">Unohditko salasanasi?</Link>
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Kirjaudu"}
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