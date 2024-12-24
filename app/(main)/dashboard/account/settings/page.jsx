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

import { updateDocument } from '@/lib/appwrite/server/appwrite';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    profile_visibility: z.enum(["everyone", "group", "hidden"]),
    public_profile_visibility: z.boolean(),
    show_email: z.boolean(),
    show_phone: z.boolean()
});

export default function Page() {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);

    const user = useUser();

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile_visibility: "everyone",
            public_profile_visibility: false,
            show_email: true,
            show_phone: true
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
                    show_phone: values.show_phone
                }
            );
            
            toast({
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

    useEffect(() => {
        if (user) {
            reset({
                profile_visibility: user.profile_visibility || "everyone",
                public_profile_visibility: user.public_profile_visibility || false,
                show_email: user.show_email || true,
                show_phone: user.show_phone || true
            });
        }
    }, [user, form]);

    if (!user) return null;

    return (
        <div className='w-full h-full px-10 max-w-5xl mx-auto'>
            <h1 className='text-2xl font-semibold mb-10'>{t("mine_settings")}</h1>
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
                                    <div className="space-y-0.5">
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
                                    <div className="space-y-0.5">
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
                                    <div className="space-y-0.5">
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
