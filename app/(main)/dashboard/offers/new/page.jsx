"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { businessCategories } from "@/types/business-categories"
import { useTranslations } from 'next-intl'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Copy, Tag, Trash2, Pencil, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { maakunnat } from "@/types/maakunnat"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { createDocument, deleteDocument } from "@/lib/appwrite/server/appwrite"
import { useUser } from "@/context/user-context"
import { fi } from 'date-fns/locale'
import { useModal } from "@/hooks/use-modal"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { storage } from "@/lib/appwrite/client/appwrite"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
    const t = useTranslations()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedCategories, setSelectedCategories] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    const { toast } = useToast()
    const { onOpen } = useModal();

    const user = useUser();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            location: "all",
        }
    })

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const handleCreateOffer = async (formData) => {
        setErrorMessage("")
        setIsLoading(true)

        if (!startDate || !endDate) {
            setErrorMessage(t("dates_required"))
            setIsLoading(false)
            return
        }

        try {
            const dataWithCategories = {
                ...formData,
                categories: selectedCategories,
                start_date: startDate,
                end_date: endDate
            }

            await createDocument("main_db", "offers", {
                body: {
                    ...dataWithCategories,
                    profiles: user.$id
                }
            })

            toast({
                title: t("offer_toast_title"),
                description: t("offer_created"),
                variant: "success"
            })
        } catch (error) {
            console.error("Error creating offer:", error)
            toast({
                title: t("offer_toast_title"),
                description: t("offer_created_error"),
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            reset();
            setSelectedCategories([])
            setStartDate(null)
            setEndDate(null)
        }
    }

    const handleEdit = (offer) => {
        onOpen("create-offer-modal", { offer });
    };

    const handleDuplicate = (offer) => {
        const duplicatedOffer = {
            ...offer,
            title: `${offer.title} (${t("copy")})`
        };
        onOpen("create-offer-modal", { offer: duplicatedOffer });
    };

    const handleDelete = (offer) => {
        onOpen("confirm-modal", {
            title: t("delete_offer"),
            description: t("confirm_delete_offer"),
            callback: async () => {
                try {
                    await deleteDocument("main_db", "offers", offer.$id);

                    toast({
                        title: t("offer_toast_title"),
                        description: t("offer_deleted_success"),
                        variant: "success"
                    })
                } catch (error) {
                    console.log(error)
                    toast({
                        title: t("offer_toast_title"),
                        description: t("offer_deleted_error"),
                        variant: "destructive"
                    })
                }
            }
        });
    };

    return (
        <div className="container mx-auto max-w-3xl">
            <div className="bg-white py-5">
                <Button onClick={() => onOpen("create-offer-modal")} className="w-full text-lg py-6 mb-1">{t("create_new_offer")}</Button>
                {/* <h2 className="text-xl font-semibold text-gray-900">{t("new_offer")}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {t("create_offer_description")}
                </p> */}
                <Separator className="my-5" />
                {/* <form onSubmit={handleSubmit(handleCreateOffer)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("offer_title")}</Label>
                            <Input
                                id="title"
                                {...register("title", { required: true })}
                                placeholder={t("offer_title_placeholder")}
                                className={cn(
                                    "w-full text-sm",
                                    errors.title && "border-red-500"
                                )}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{t("field_required")}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t("categories")}</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="description">{t("description")}</Label>
                            <Textarea
                                id="description"
                                {...register("description", { required: true })}
                                placeholder={t("offer_description_placeholder")}
                                className={cn(
                                    "min-h-[150px] text-sm",
                                    errors.description && "border-red-500"
                                )}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{t("field_required")}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t("location")}</Label>
                            <Select
                                {...register("location")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("all")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"all"}>
                                        {t("all")}
                                    </SelectItem>
                                    {maakunnat.map(value => (
                                        <SelectItem key={value} value={value}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>{t("start_date")}</Label>
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
                                <Label>{t("end_date")}</Label>
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

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("create")}
                            </Button>
                        </div>
                    </div>
                </form> */}
                <h1 className="text-xl font-semibold mb-8 max-md:text-xl">{t("my_offers")}</h1>
                <div className="grid grid-cols-1 gap-4 mt-5">
                    {user && user.offers?.length > 0 && user.offers.map((offer) => (
                        <Card key={offer.$id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                                        {offer?.categories.map((category) => (
                                            <Badge key={category} variant="secondary" className="mr-2 mb-2 bg-indigo-50 hover:bg-indigo-50 text-indigo-700">
                                                {t(category)}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-lg flex items-center font-bold text-indigo-600">
                                        <span>{format(new Date(offer.start_date), "dd.MM.yyyy")}</span>
                                        <span className="mx-3"> - </span>
                                        <span>{format(new Date(offer.end_date), "dd.MM.yyyy")}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{offer.description}</p>
                                <div className="flex flex-col space-y-2 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <span className="font-medium mr-2">{t("offer_location")}:</span>
                                        {offer.location === "all" ? t("all") : offer.location}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="relative flex items-center">
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                    </div>
                                    {t("you")}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-red-600 hover:text-red-700"
                                        title={t("delete_offer")}
                                        onClick={() => handleDelete(offer)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-blue-600 hover:text-blue-700"
                                        title={t("duplicate_offer")}
                                        onClick={() => handleDuplicate(offer)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700"
                                        title={t("edit_offer")}
                                        onClick={() => handleEdit(offer)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>

                            </CardFooter>
                        </Card>
                    ))}

                    {user && user.offers?.length === 0 && (
                        <p className="text-gray-500">{t("no_offers")}</p>
                    )}
                </div>
            </div>
        </div>
    )
}