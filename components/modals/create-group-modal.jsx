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

export function CreateGroupModal() {
    const [isLoading, setIsLoading] = useState(false)
    const t = useTranslations()
    const user = useUser();
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "create-group-modal";
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const updateUser = useUpdateUser();

    async function onSubmit(values) {
        try {
            setIsLoading(true);

            if (data.edit) {
                const group = await updateDocument("main_db", "groups", data.group.$id, {
                    name: values.name,
                    description: values.description,
                })
            } else {
                const group = await createDocument("main_db", "groups", {
                    body: {
                        profiles: user.$id,
                        name: values.name,
                        description: values.description,
                    }
                })

                if (group) {

                    await createDocument("main_db", "group_members", {
                        body: {
                            profiles: user.$id,
                            groups: group.$id,
                            role: "admin",
                        }
                    })
                }
            }

            await updateUser();
            form.reset();

            toast({
                variant: "success",
                title: "Onnistui",
                description: "Ryhmä on luotu onnistuneesti.",
            })
        } catch (error) {
            console.log("Error creating network:", error)
        } finally {
            setIsLoading(false);
            onClose();
        }

    }

    useEffect(() => {

        if (data?.edit) {
            form.reset({
                name: data.group.name || "",
                description: data.group.description || ""
            })
        }
    }, [data])
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("create_group")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("group_name")}</FormLabel>
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {data.edit ? t("save") : t("create")}
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}