"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/use-modal';
import { Eye, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createDocument, updateDocument } from '@/lib/appwrite/server/appwrite';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00"];
const minutes = ["00", "15", "30", "45"];



const CreateMeetingModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tab, setTab] = useState(true);

    const user = useUser();
    const router = useRouter();

    const { isOpen, onClose, type, data } = useModal();
    const t = useTranslations();

    const formSchema = z.object({
        title: z.string().min(1, {
            message: t("meeting_title_required")
        }),
        description: z.string().min(1, {
            message: t("meeting_description_required")
        }),
        start_time: z.any().refine((val) => val !== '', {
            message: t("meeting_start_time_required")
        }),
        end_time: z.any().refine((val) => val !== '', {
            message: t("meeting_end_time_required")
        }),
        date: z.any().refine((val) => val !== '', {
            message: t("meeting_date_required")
        }),
        location: z.string().min(1, {
            message: t("meeting_location_required")
        })
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            date: '',
            location: ''
        }
    });

    const { reset } = form;

    const { toast } = useToast();

    const isModalOpen = isOpen && type === "create-meeting";

    const onSubmit = async (values) => {
        if (data.edit) {
            try {
                setIsLoading(true);

                const res = await updateDocument("main_db", "meets", data.meet.$id, {
                    ...values
                });

                toast({
                    variant: "success",
                    title: "Tapaaminen",
                    description: "Tapaaminen on talennettu onnistuneesti."
                })
            } catch (error) {
                console.error("Error creating meeting:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);

                const res = await createDocument("main_db", "meets", {
                    body: {
                        profiles: data.recipient.$id,
                        sender_id: user.$id,
                        ...values
                    }
                });

                toast({
                    variant: "success",
                    title: "Tapaaminen",
                    description: "Tapaaminen on luotu onnistuneesti."
                })
            } catch (error) {
                console.error("Error creating meeting:", error);
            } finally {
                setIsLoading(false);
            }
        }

        router.refresh();
        onClose();
        form.reset();
    };

    useEffect(() => {
        if (data.edit) {
            reset({
                title: data.meet.title || '',
                description: data.meet.description || '',
                start_time: data.meet.start_time || '',
                end_time: data.meet.end_time || '',
                date: new Date(data.meet.date) || '',
                location: data.meet.location || ''
            });
        }

        return () => {
            document.body.style.pointerEvents = "auto"
        }
    }, []);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="min-h-[450px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {data?.edit ? t("edit_meeting") : t("create_meeting")}
                    </DialogTitle>
                    <div className="flex border-b border-gray-200 !mt-3">
                        <button
                            onClick={() => setTab(true)}
                            className={`px-3 py-2 -mb-px text-sm font-medium ${tab
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                                }`}
                        >
                            {t("basic_info")}
                        </button>
                        <button
                            onClick={() => setTab(false)}
                            className={`px-3 py-2 -mb-px text-sm font-medium ${!tab
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                                }`}
                        >
                            {t("notes")}
                        </button>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col h-full flex-1'>
                        <div className={tab ? "block space-y-4 flex-1" : "hidden"}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("meeting_title")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("meeting_title")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("meeting_date")}</FormLabel>
                                            <FormControl>
                                                <DatePicker {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("meeting_location")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("meeting_location")} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("meeting_start_time")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("select_time")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hours.map((hour) => (
                                                        <SelectGroup key={hour}>
                                                            {minutes.map((minute) => (
                                                                <SelectItem
                                                                    key={`${hour}:${minute}`}
                                                                    value={`${hour}:${minute}`}
                                                                >
                                                                    {`${hour}:${minute}`}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("meeting_end_time")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("select_time")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hours.map((hour) => (
                                                        <SelectGroup key={hour}>
                                                            {minutes.map((minute) => (
                                                                <SelectItem
                                                                    key={`${hour}:${minute}`}
                                                                    value={`${hour}:${minute}`}
                                                                >
                                                                    {`${hour}:${minute}`}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className={!tab ? "block mb-auto" : "hidden"}>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("notes")}</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[212px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="self-end mt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {data?.edit ? t("save_changes") : t("create_meeting")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateMeetingModal;
