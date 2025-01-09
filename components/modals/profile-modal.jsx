"use client"

import Link from 'next/link';
import { businessNetworksType } from '@/types/business-networks-type';
import { Loader2, Plus, Settings, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

import { useModal } from '@/hooks/use-modal';
import MultipleCheckbox from '../multiple-checkbox';

import { useUser } from '@/context/user-context';
import { useEffect, useState } from 'react';
import { updateDocument } from '@/lib/appwrite/server/appwrite';

const formSchema = z.object({
    first_name: z.string()
        .min(1, { message: "First name is required" }),
    last_name: z.string()
        .min(1, { message: "Last name is required" }),
    address: z.string()
        .optional(),
    email: z.string()
        .email(),
    job_title: z.string()
        .optional(),
    location: z.string()
        .optional(),
    avatar: z.string()
        .optional(),
    phone: z.string()
        .optional(),
    website: z.string()
        .optional(),
    offering: z.string()
        .optional(),
    searching: z.string()
        .optional(),
    introduction: z.string()
        .optional(),
    business_networks: z.array(z.string())
        .optional()
});

export default function ProfileModal() {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();

    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "profile-modal";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            address: "",
            email: "",
            job_title: "",
            location: "",
            company: "",
            avatar: "",
            phone: "",
            website: "",
            offering: "",
            searching: "",
            introduction: "",
            business_networks: []
        }
    });

    const { reset } = form;

    const onSubmit = async (values) => {
        setIsLoading(true);

        const { first_name, last_name, ...rest } = values;

        const updatedUser = {
            name: `${first_name} ${last_name}`,
            ...rest,
        };
        
        try {
            const response = await updateDocument(
                "main_db",
                "profiles",
                user.$id,
                updatedUser
            );

            console.log("Update response:", response);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
            // onClose();
        }
    }

    useEffect(() => {
        if (user) {
            const tempName = user.name.split(" ");
            const firstName = tempName[0];
            const lastName = tempName[1] || "";

            reset({
                first_name: firstName || "",
                last_name: lastName || "",
                address: user.address || "",
                email: user.email || "",
                job_title: user.job_title || "",
                location: user.location || "",
                // company: "",
                avatar: user.avatar || "",
                phone: user.phone || "",
                website: user.website || "",
                offering: user.offering || "",
                searching: user.searching || "",
                introduction: user.introduction || "",
                business_networks: user.business_networks || []
            });
        }
    }, []);


    if (!user) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="mb-5">
                    <DialogTitle>{t("edit_profile")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("first_name")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("last_name")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("email")} </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="job_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("job_title")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("phone_number")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="tel" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("location")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Helsinki" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("website")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="url" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("avatar")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(e) => field.onChange(e.target.files[0])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="business_networks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("business_networks")}</FormLabel>
                                        <FormControl>
                                            <MultipleCheckbox
                                                placeholder={t("select_networks")}
                                                options={businessNetworksType}
                                                field={field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="introduction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("introduction")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="!mt-1"
                                                placeholder={t("placeholder_introduction")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="offering"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("offering")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="!mt-1"
                                                placeholder={t("placeholder_offering")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="searching"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("searching")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="!mt-1"
                                                placeholder={t("placeholder_searching")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin shrink-0" /> : t("save")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>

    );
}
