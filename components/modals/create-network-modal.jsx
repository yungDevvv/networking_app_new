"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useModal } from "@/hooks/use-modal"
import { createDocument, updateDocument } from "@/lib/appwrite/server/appwrite"
import { useUpdateUser, useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Tämä on pakollinen kenttä.",
    }),
    description: z.string().min(2, {
        message: "Tämä on pakollinen kenttä.",
    }),
})

export function CreateNetworkModal() {
    const [isLoading, setIsLoading] = useState(false)
    const t = useTranslations()
    const user = useUser();
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "create-network-modal";

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const { toast } = useToast();

    const { reset } = form;

    const updateUser = useUpdateUser(); 

    async function onSubmit(values) {
        if (data.edit) {
            try {
                setIsLoading(true)

                const network = await updateDocument("main_db", "networks", data.network.$id, values)

                if (data?.mutate) {
                    data.mutate()
                }

                toast({
                    variant: "success",
                    title: "Verkosto",
                    description: "Verkosto on tallennettu onnistuneesti."
                })

                onClose()
                form.reset()
                router.refresh();
            } catch (error) {
                console.log("Error creating network:", error)
                toast({
                    variant: "internalError",
                    description: "Tuntematon virhe verkoston luonnissa."
                });
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                setIsLoading(true)

                const network = await createDocument("main_db", "networks", {
                    body: {
                        profiles: user.$id,
                        name: values.name,
                        description: values.description,
                    }
                })

                if (network) {
                    await createDocument("main_db", "members", {
                        body: {
                            profiles: user.$id,
                            networks: network.$id,
                            role: "admin",
                        }
                    })
                }

                toast({
                    variant: "success",
                    title: "Verkosto",
                    description: "Verkosto on luotu onnistuneesti."
                })

                if (data?.mutate) {
                    data.mutate()
                }

                onClose()
                form.reset()
                router.refresh();
            } catch (error) {
                console.log("Error creating network:", error)
            } finally {
                setIsLoading(false)
            }
        }
        await updateUser();
    }

    useEffect(() => {
        if (data.edit) {
            reset({
                name: data.network.name || "",
                description: data.network.description || "",
            });
        }

        return () => {
            document.body.style.pointerEvents = "auto"
        }
    }, []);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>{t("create_network")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("network_name")}</FormLabel>
                                    <FormControl>
                                        <Input className="!mt-1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="h-32 !mt-1"
                                            placeholder={t("network_description_placeholder")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {data.edit ? t("save") : t("create")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}