"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { fi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useUpdateUser, useUser } from "@/context/user-context";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createDocument, updateDocument } from "@/lib/appwrite/server/appwrite";
import { maakunnat } from "@/types/maakunnat";
import { businessCategories } from "@/types/business-categories";

export function CreateOfferModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    const t = useTranslations();
    const user = useUser();
    const updateUser = useUpdateUser();
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "create-offer-modal";
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            location: "all",
        }
    });

    useEffect(() => {
        if (data?.offer) {
            form.reset({
                title: data.offer.title,
                description: data.offer.description,
                location: data.offer.location,
            });
            setSelectedCategories(data.offer.categories);
            setStartDate(new Date(data.offer.start_date));
            setEndDate(new Date(data.offer.end_date));
        }
    }, [data, form]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            if (!selectedCategories.length) {
                setErrorMessage(t("select_at_least_one_category"));
                return;
            }

            if (!startDate || !endDate) {
                setErrorMessage(t("select_dates"));
                return;
            }

            const offerData = {
                ...data,
                categories: selectedCategories,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                profiles: user.$id
            };

            if (data?.offer) {
                await updateDocument("main_db", "offers", data.offer.$id, offerData);
                await updateUser();
                toast({
                    variant: "success",
                    description: t("offer_updated")
                });

            } else {
                await createDocument("main_db", "offers", {
                    body: offerData
                });
                await updateUser();
                toast({
                    variant: "success",
                    title: "Tarjous",
                    description: t("offer_created")
                });
            }

            handleClose();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: t("error_saving_offer")
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        setSelectedCategories([]);
        setStartDate(null);
        setEndDate(null);
        setErrorMessage("");
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{data?.offer ? t("edit_offer") : t("create_new_offer")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("offer_title")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder={t("offer_title_placeholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>{t("categories")}</FormLabel>
                            <div className="space-y-2">
                                {businessCategories.map((category) => (
                                    <div
                                        key={category}
                                        onClick={() => toggleCategory(category)}
                                        className={cn(
                                            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mr-2 cursor-pointer",
                                            selectedCategories.includes(category)
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>{t(category)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder={t("offer_description_placeholder")}
                                            className="min-h-[150px]"
                                            {...field}
                                        />
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
                                    <FormLabel>{t("location")}</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("all")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all">{t("all")}</SelectItem>
                                            {maakunnat.map((value) => (
                                                <SelectItem key={value} value={value}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel>{t("start_date")}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "dd.MM.yyyy", { locale: fi }) : <span>{t("start_date")}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                            locale={fi}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>{t("end_date")}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "dd.MM.yyyy", { locale: fi }) : <span>{t("end_date")}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                            locale={fi}
                                            disabled={(date) =>
                                                date < new Date() || (startDate && date < startDate)
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md">
                                {errorMessage}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} type="button">
                                {t("cancel")}
                            </Button>
                            <Button disabled={isLoading} type="submit">
                                {data?.offer ? t("save") : t("create")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateOfferModal;
