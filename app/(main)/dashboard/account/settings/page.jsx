"use client"

import { Loader2, Plus, Settings, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { businessNetworksType } from '@/types/business-networks-type';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
    CardContent
} from '@/components/ui/card'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

import MultipleCheckbox from '@/components/multiple-checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

import { useUser } from '@/context/user-context';
import { useEffect, useState } from 'react';

import { createRecoveryPassword, createSessionClient, updateDocument } from '@/lib/appwrite/server/appwrite';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/hooks/use-modal';
import { useOrigin } from '@/hooks/use-origin';

const formSchema = z.object({
    profile_visibility: z.enum(["everyone", "group", "hidden"]),
    public_profile_visibility: z.boolean(),
    show_email: z.boolean(),
    show_phone: z.boolean(),
    google_review_link: z.string().optional()
});

export default function Page() {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const origin = useOrigin();
    const { onOpen } = useModal();

    const user = useUser();

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile_visibility: "everyone",
            public_profile_visibility: false,
            show_email: true,
            show_phone: true,
            google_review_link: ""
        }
    });

    const { reset } = form;

    const onSubmit = async (values) => {
        setIsLoading(true);

        try {
            const response = await updateDocument(
                "main_db",
                "profiles",
                user.$id,
                {
                    profile_visibility: values.profile_visibility,
                    public_profile_visibility: values.public_profile_visibility,
                    show_email: values.show_email,
                    show_phone: values.show_phone,
                    google_review_link: values.google_review_link
                }
            );

            toast({
                variant: "success",
                title: t('toast_profile_title'),
                description: t('toast_profile_updated')
            })

        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: t('toast_profile_title'),
                description: t('toast_error_unknown'),
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const passwordRecovery = async () => {


        const res = await createRecoveryPassword(origin + "/update-password");

        // if(res) {
        toast({
            variant: "success",
            title: t('toast_profile_title'),
            description: t('toast_password_recovery')
        })
        // }
        // toast({
        //     title: t('toast_profile_title'),
        //     description: t('toast_error_unknown'),
        //     variant: "destructive"
        // });
        // return;
    }

    useEffect(() => {
        if (user) {
            reset({
                profile_visibility: user.profile_visibility || "everyone",
                public_profile_visibility: user.public_profile_visibility || false,
                show_email: user.show_email || true,
                show_phone: user.show_phone || true,
                google_review_link: user.google_review_link || ""
            });
        }
    }, [user, form]);

    if (!user) return null;

    return (
        <div className='w-full h-full max-w-5xl pl-10 max-lg:pl-5 mx-auto pb-10 max-sm:pl-0'>
            <h1 className='text-2xl font-semibold mb-10 max-md:text-xl max-md:mb-5'>{t("mine_settings")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="profile_visibility"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{t("profile_visibility")}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-3"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="everyone" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium">{t("everyone")}</FormLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t("everyone_description")}
                                                    </p>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="group" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium">{t("group")}</FormLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t("group_description2")}
                                                    </p>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="hidden" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium">{t("hidden")}</FormLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t("hidden_description")}
                                                    </p>
                                                </div>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator />
                        <FormField
                            control={form.control}
                            name="public_profile_visibility"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5 mr-3">
                                        <FormLabel>{t("public_profile")}</FormLabel>
                                        <FormDescription>
                                            {t("public_profile_description")}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="show_email"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5 mr-3">
                                        <FormLabel>{t("email_visibility")}</FormLabel>
                                        <FormDescription>
                                            {t("email_visibility_description")}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="show_phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5 mr-3">
                                        <FormLabel>{t("phone_visibility")}</FormLabel>
                                        <FormDescription>
                                            {t("phone_visibility_description")}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <div className="flex justify-between items-center max-xs:flex-col">
                            <div className="mr-3 space-y-0.5">
                                <FormLabel>{t("password_recovery")}</FormLabel>
                                <FormDescription>
                                    {t("password_recovery_description")}
                                </FormDescription>
                            </div>

                            <Button className="max-xs:mt-3 max-xs:w-full" type="button" onClick={() => onOpen("confirm-modal", {
                                type: "mail",
                                title: t("password_recovery_confirm_title"),
                                description: t("password_recovery_confirm_description"),
                                callback: passwordRecovery
                            })}>{t("reset_password")}</Button>
                        </div>
                        <Separator />
                        <FormField
                            control={form.control}
                            name="google_review_link"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="space-y-0.5">
                                        <FormLabel>{t("google_review_link")}</FormLabel>
                                        <FormDescription>
                                            {t("google_review_description")}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            className="!mt-3"
                                            placeholder={t("google_review_placeholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        {/* YOUR CODE HERE */}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin shrink-0" /> : t("save")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
