"use client";

import { Fragment, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/hooks/use-documents";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import OfferFilters from "@/components/offers/offer-filters";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"

import { storage } from "@/lib/appwrite/client/appwrite";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

const OffersPage = () => {
    const t = useTranslations();
    const { onOpen } = useModal();
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        location: 'all',
        timeRange: 'all',
        category: 'all'
    });

    const { documents, isLoading, isError } = useDocuments("main_db", "offers");

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Filtering and search
    useEffect(() => {
        if (!documents) return;

        let results = [...documents];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            results = results.filter(doc => {
                const searchableFields = [
                    doc.title,
                    doc.description,
                    doc.location
                ].filter(Boolean);

                return searchableFields.some(field =>
                    field.toLowerCase().includes(searchLower)
                );
            });
        }

        // Location filter
        if (activeFilters.location !== 'all') {
            results = results.filter(doc =>
                doc.location?.toLowerCase() === activeFilters.location.toLowerCase()
            );
        }

        // Category filter
        if (activeFilters.category !== 'all') {
            results = results.filter(doc =>
                doc.categories?.includes(activeFilters.category)
            );
        }

        // Time filter
        if (activeFilters.timeRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            results = results.filter(doc => {
                const docDate = new Date(doc.$createdAt);

                switch (activeFilters.timeRange) {
                    case 'today':
                        return docDate >= today;
                    case 'this_week':
                        return docDate >= startOfWeek;
                    case 'this_month':
                        return docDate >= startOfMonth;
                    default:
                        return true;
                }
            });
        }

        setFilteredOffers(results);
    }, [documents, searchTerm, activeFilters]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t("navbar_offers")}</h1>
            </div>

            <OfferFilters
                searchTerm={searchTerm}
                onSearch={handleSearch}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
            />

            <div className="grid grid-cols-1 gap-6">

                {isLoading && (
                    <div className="w-full flex items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                    </div>
                )}

                {!isLoading && filteredOffers && filteredOffers.map((offer) => (
                    <Card key={offer.$id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                                    {offer.categories.map((category) => (
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
                        <CardFooter className="justify-between">
                            <div className="flex items-center">
                                <Avatar className="h-12 w-12 rounded-xl">
                                    <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", offer.profiles.avatar)} />
                                    <AvatarFallback>
                                        <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <h3 className="">{offer.profiles.name}</h3>
                                </div>
                            </div>
                            <Button
                                onClick={() => onOpen("create-contact-offer-modal", { offer })}
                                className=""
                            >
                                Ota yhteyttä
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {!isLoading && filteredOffers && filteredOffers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">{t("no_offers")}</p>
                </div>
            )}
        </div>
    );
};

export default OffersPage;