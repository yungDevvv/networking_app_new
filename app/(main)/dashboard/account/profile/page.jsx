"use client"

import { Loader2, Plus, Settings, X, ChevronsUpDown, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { businessNetworksType } from '@/types/business-networks-type';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormDescription,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

import MultipleCheckbox from '@/components/multiple-checkbox';

import { useUser } from '@/context/user-context';
import { useEffect, useState } from 'react';

import { updateDocument } from '@/lib/appwrite/server/appwrite';
import { storage } from '@/lib/appwrite/client/appwrite';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/hooks/use-documents';
import { useModal } from '@/hooks/use-modal';
import SVGComponent from '@/components/svg-image';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    first_name: z.string()
        .min(1, { message: "First name is required" }),
    last_name: z.string()
        .min(1, { message: "Last name is required" }),
    address: z.string()
        .optional(),
    email: z.string()
        .email(),
    company: z.string()
        .optional(),
    job_title: z.string()
        .optional(),
    location: z.string()
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

export default function Page({ }) {
    const { documents: companies, isLoading: companiesIsLoading } = useDocuments("main_db", "companies");

    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const user = useUser();

    const { toast } = useToast();

    const { onOpen } = useModal();

    const [open, setOpen] = useState(false);

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

            toast({
                variant: "success",
                title: "Profiili",
                description: "Tiedot on tallennettu onnistuneesti.",
            })
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Tiedot ei ole tallennettu.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
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
                company: user.company || "",
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
        <div className='w-full max-w-5xl pl-10 max-lg:pl-5 h-full pb-10 max-sm:pl-0'>
            <h1 className='text-2xl font-semibold mb-10 max-md:text-xl max-md:mb-5'>{t("edit_profile")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-3 gap-x-6">
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
                            name="company"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t("company")}</FormLabel>
                                    <div className='flex items-center'>
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {console.log(field, "FIELD VALUE!!!!!!!!!!!!!!")}
                                                        {console.log(companies)}
                                                        {field.value && companies ? companies.find((company) => company.$id === field.value)?.name : "Select company"}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>

                                                </FormControl>
                                            </DialogTrigger>
                                            <DialogContent className="w-full p-0">
                                                <DialogTitle className="hidden"></DialogTitle>
                                                <DialogDescription className="hidden"></DialogDescription>
                                                <Command>
                                                    <CommandInput
                                                        placeholder={t("search_companies")}
                                                        className="h-[55px]"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty className="w-full flex justify-center my-5"><Loader2 className="text-indigo-500 h-4 w-4 animate-spin" /></CommandEmpty>

                                                        <CommandGroup className="!space-y-2">
                                                            {companies && companies.map((company) => (
                                                                <CommandItem
                                                                    value={company.name}
                                                                    key={company.name}
                                                                    onSelect={() => {
                                                                        form.setValue("company", company.$id);
                                                                        setOpen(false);
                                                                    }}
                                                                    className="text-base font-medium cursor-pointer !bg-white last:border-b-0 py-3 mx-4 hover:!text-indigo-500 hover:shadow-sm"
                                                                >
                                                                    <SVGComponent
                                                                        url={storage.getFileView(
                                                                            "logos",
                                                                            company.logo
                                                                        )}
                                                                        alt="company logo"
                                                                        className="w-20"
                                                                    />
                                                                    {company.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            company.name === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </DialogContent>
                                        </Dialog>
                                        {user?.companies
                                            ? (
                                                <Button type="button" className="border ml-2 w-11 hover:!text-indigo-500" variant="icons" onClick={() => onOpen("create-company-modal", { edit: true, company: user.companies })}>
                                                    <Settings />
                                                </Button>
                                            )
                                            : (
                                                <Button type="button" className="border ml-2 w-11 hover:!text-indigo-500" variant="icons" onClick={() => onOpen("create-company-modal", { edit: false })}>
                                                    <Plus />
                                                </Button>
                                            )

                                        }

                                    </div>

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
                                        <Input {...field} type="text" />
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
                                            placeholder="Valitse verkostot"
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
                                            className="!mt-1 h-[150px]"
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
                                            className="!mt-1 h-[150px]"
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
                                            className="!mt-1 h-[150px]"
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
        </div >


    );
}
