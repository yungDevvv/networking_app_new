"use client"

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/user-context";
import { useModal } from "@/hooks/use-modal";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createDocument, updateDocument, createFile } from "@/lib/appwrite/server/appwrite";
import { toast } from "sonner";
import { storage } from "@/lib/appwrite/client/appwrite";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
});

export function CreateCompanyModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const fileInputRef = useRef(null);

    const t = useTranslations();
    const user = useUser();
    const router = useRouter();
    const { type, isOpen, onClose, data } = useModal();

    const isModalOpen = isOpen && type === "create-company-modal";
    const isEditMode = data?.edit === true;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedLogo({ file, preview: imageUrl });
        }
    };

    async function onSubmit(values) {
        try {
            setIsLoading(true);

            if (isEditMode && data?.company) {
                let logoId = data.company.logo;

                if (selectedLogo?.file) {
                    logoId = await createFile("logos", null, selectedLogo.file);
                }

                await updateDocument("main_db", "companies", data.company.$id, {
                    name: values.name,
                    logo: logoId,
                });

                // toast.success(t("company_updated"));
            } else {
                let logoId = null;
                if (selectedLogo?.file) {
                    logoId = await createFile("logos", null, selectedLogo.file);
                }

                await createDocument("main_db", "companies", {
                    body: {
                        name: values.name,
                        logo: logoId,
                        profiles: user.$id,
                    }
                });

                await updateDocument("main_db", "profiles", user.$id, {
                    company: logoId,
                });
                // toast.success(t("company_created"));
            }

            router.refresh();
            onClose();
            form.reset();
            setSelectedLogo(null);
        } catch (error) {
            console.log(error);
            // toast.error(isEditMode ? t("company_update_error") : t("company_create_error"));
        } finally {
            setIsLoading(false);
        }
    }

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (selectedLogo?.preview && selectedLogo.file) {
                URL.revokeObjectURL(selectedLogo.preview);
            }
        };
    }, [selectedLogo]);

    // Set initial form values when editing
    useEffect(() => {
        if (isEditMode && data?.company) {
            form.setValue("name", data.company.name);
            if (data.company.logo) {
                setSelectedLogo({
                    file: null,
                    preview: storage.getFileView("logos", data.company.logo)
                });
            }
        }
    }, [data, form, isEditMode]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? t("edit_company") : t("create_company")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("company_name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>{t("company_logo")}</FormLabel>
                            <div className="flex flex-col items-center gap-4">
                                {selectedLogo?.preview && (
                                    <div className="relative h-32 rounded-lg overflow-hidden">
                                        <img
                                            src={selectedLogo.preview}
                                            alt="Logo preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-indigo-500 hover:!bg-white text-indigo-500 hover:text-indigo-500"
                                    >
                                        {selectedLogo?.preview ? t("change_logo") : t("upload_logo")}
                                    </Button>
                                </div>
                            </div>
                        </FormItem>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? t("save") : t("create")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}