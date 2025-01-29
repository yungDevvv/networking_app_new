"use client"

import { useLocale, useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from '@/components/ui/button'

import { ChevronRight, Trash2, Eye, Star } from 'lucide-react'

import { useState } from 'react'

import { useModal } from "@/hooks/use-modal"
import { useUpdateUser, useUser } from '@/context/user-context'
import { formatDateTime } from '@/lib/utils'
import { deleteDocument, updateDocument } from '@/lib/appwrite/server/appwrite'
import { useToast } from '@/hooks/use-toast'
import { storage } from '@/lib/appwrite/client/appwrite'

// Yhteystietojen sivu
export default function Page() {
    const t = useTranslations();

    const { onOpen } = useModal();

    const user = useUser();

    const updateUser = useUpdateUser();

    const [contentOpen, setContentOpen] = useState(1);

    const locale = useLocale();

    const { toast } = useToast();

    const handleDeleteOfferContact = async (contact_offer_id) => {
        try {
            await deleteDocument("main_db", "contact_offers", contact_offer_id);
            toast({
                variant: "success",
                title: "Yhteydenotto",
                description: "Yhteydenotto on poistettu onnistuneesti."
            })
            await updateUser();
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Tuntematon virhe."
            });
        }
    }

    const handleAddToFavorites = async (contact_offer) => {
        try {
            if (contact_offer.is_favorite === true) {
                await updateDocument("main_db", "contact_offers", contact_offer.$id, { is_favorite: false });
                toast({
                    variant: "success",
                    title: "Suosikki",
                    description: "Yhteydenotto on poistettu suosikista."
                })
            } else {
                await updateDocument("main_db", "contact_offers", contact_offer.$id, { is_favorite: true });
                toast({
                    variant: "success",
                    title: "Suosikki",
                    description: "Yhteydenotto on lisätty suosikkiin."
                })

            }
            await updateUser();
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Tuntematon virhe."
            });
        }
    }

    const handleMarkAsReaded = async (contact_offer) => {
        try {
            await updateDocument("main_db", "contact_offers", contact_offer.$id, { status: "readed" });
            await updateUser();
            toast({
                variant: "success",
                title: "Yhteydenotto",
                description: "Yhteydenotto on merkitty luetuksi."
            })
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Tuntematon virhe."
            });
        }
    }

    const favoriteContactOffers = user?.contact_offers?.filter((contact_offer) => contact_offer.is_favorite === true);
    const newContactOffers = user?.contact_offers?.filter((contact_offer) => contact_offer.status === "new");
    const readedContactOffers = user?.contact_offers?.filter((contact_offer) => contact_offer.status === "readed");

    return (
        <div className="container mx-auto max-w-5xl">
            <div>
                <h1 className="text-2xl font-semibold mb-8 max-md:text-xl">Yhteyden otot</h1>
            </div>
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    onClick={() => setContentOpen(1)}
                    className={`px-3 max-md:!px-2 py-2 -mb-px font-medium ${contentOpen === 1
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                        }`}
                >
                    Uudet
                </button>
                <button
                    onClick={() => setContentOpen(2)}
                    className={`px-3 max-md:!px-2 py-2 -mb-px font-medium ${contentOpen === 2
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                        }`}
                >
                    Luetut
                </button>
                <button
                    onClick={() => setContentOpen(3)}
                    className={`px-3 max-md:!px-2 py-2 -mb-px font-medium ${contentOpen === 3
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                        }`}
                >
                    Suosikit
                </button>
            </div>
            <div className='space-y-2'>
                {contentOpen === 1 && newContactOffers?.length > 0
                    ? newContactOffers?.map((contact_offer) => (
                        <div key={contact_offer.$id} className="flex items-center gap-3 bg-gray-50 py-2 px-2 rounded-lg">
                            {contact_offer.status === "new" && <div className="bg-indigo-50 rounded-lg py-1 px-2 text-sm text-indigo-600 font-medium">NEW</div>}
                            <Avatar className="h-12 w-12 rounded-xl">
                                <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", contact_offer.sender.avatar)} />
                                <AvatarFallback>
                                    <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="max-xl:text-sm" ><span className="font-semibold">{contact_offer.sender.name}</span> jätti yhteydenoton <span className="font-semibold">"{contact_offer.offers.title}"</span></h3>
                                <p className="text-sm max-xl:text-xs text-gray-500">{formatDateTime(contact_offer.$createdAt, locale)}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                                <Button className="h-8 w-9" variant="ghost" title="Delete" onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistaa yhteydenoton?", callback: () => handleDeleteOfferContact(contact_offer.$id) })}>
                                    <Trash2 />
                                </Button>
                                {contentOpen !== 2 && contact_offer.status !== "readed" && (
                                    <Button className="h-8 w-9" variant="ghost" title="Mark as readed" onClick={() => handleMarkAsReaded(contact_offer)}>
                                        <Eye />
                                    </Button>
                                )}
                                <Button className="h-8 w-9" variant="ghost" title="Mark as favorite" onClick={() => handleAddToFavorites(contact_offer)}>
                                    <Star className={contact_offer.is_favorite ? "text-yellow-500" : ""} />
                                </Button>
                                <Button className="h-8 w-9" variant="ghost" onClick={() => onOpen("contact-details-modal", { contact_offer })}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    ))
                    : contentOpen === 1 && <span className='text-sm'>Ei uusia yhteydenottoja.</span>
                }
                {contentOpen === 2 && readedContactOffers?.length > 0
                    ? readedContactOffers?.map((contact_offer) => (
                        <div key={contact_offer.$id} className="flex items-center gap-3 bg-gray-50 py-2 px-2 rounded-lg">
                            <Avatar className="h-12 w-12 rounded-xl">
                                <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", contact_offer.sender.avatar)} />
                                <AvatarFallback>
                                    <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="max-xl:text-sm" ><span className="font-semibold">{contact_offer.sender.name}</span> jätti yhteydenoton <span className="font-semibold">"{contact_offer.offers.title}"</span></h3>
                                <p className="text-sm max-xl:text-xs text-gray-500">{formatDateTime(contact_offer.$createdAt, locale)}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                                <Button className="h-8 w-9" variant="ghost" title="Delete" onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistaa yhteydenoton?", callback: () => handleDeleteOfferContact(contact_offer.$id) })}>
                                    <Trash2 />
                                </Button>
                                {contentOpen !== 2 && contact_offer.status !== "readed" && (
                                    <Button className="h-8 w-9" variant="ghost" title="Mark as readed" onClick={() => handleMarkAsReaded(contact_offer)}>
                                        <Eye />
                                    </Button>
                                )}
                                <Button className="h-8 w-9" variant="ghost" title="Mark as favorite" onClick={() => handleAddToFavorites(contact_offer)}>
                                    <Star className={contact_offer.is_favorite ? "text-yellow-500" : ""} />
                                </Button>
                                <Button className="h-8 w-9" variant="ghost" onClick={() => onOpen("contact-details-modal", { contact_offer })}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    ))
                    : contentOpen === 2 && <span className='text-sm'>Ei luettuja yhteydenottoja.</span>
                }
                {contentOpen === 3 && favoriteContactOffers?.length > 0
                    ? favoriteContactOffers?.map((contact_offer) => (
                        <div key={contact_offer.$id} className="flex items-center gap-3 bg-gray-50 py-2 px-2 rounded-lg">
                            {contact_offer.status === "new" && <div className="bg-indigo-50 rounded-lg py-1 px-2 text-sm text-indigo-600 font-medium">NEW</div>}
                            <Avatar className="h-12 w-12 rounded-xl">
                                <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", contact_offer.sender.avatar)} />
                                <AvatarFallback>
                                    <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="max-xl:text-sm" ><span className="font-semibold">{contact_offer.sender.name}</span> jätti yhteydenoton <span className="font-semibold">"{contact_offer.offers.title}"</span></h3>
                                <p className="text-sm max-xl:text-xs text-gray-500">{formatDateTime(contact_offer.$createdAt, locale)}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                                <Button className="h-8 w-9" variant="ghost" title="Delete" onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistaa yhteydenoton?", callback: () => handleDeleteOfferContact(contact_offer.$id) })}>
                                    <Trash2 />
                                </Button>
                                {contentOpen !== 2 && contact_offer.status !== "readed" && (
                                    <Button className="h-8 w-9" variant="ghost" title="Mark as readed" onClick={() => handleMarkAsReaded(contact_offer)}>
                                        <Eye />
                                    </Button>
                                )}
                                <Button className="h-8 w-9" variant="ghost" title="Mark as favorite" onClick={() => handleAddToFavorites(contact_offer)}>
                                    <Star className={contact_offer.is_favorite ? "text-yellow-500" : ""} />
                                </Button>
                                <Button className="h-8 w-9" variant="ghost" onClick={() => onOpen("contact-details-modal", { contact_offer })}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    ))
                    : contentOpen === 3 && <span className='text-sm'>Ei yhteydenottoja.</span>
                }
                {/* {user?.contact_offers?.length > 0 && user?.contact_offers?.map((contact_offer) => (
                    <div key={contact_offer.$id} className="flex items-center gap-3 bg-gray-50 py-2 px-2 rounded-lg">
                        <div className="bg-indigo-50 rounded-lg py-1 px-2 text-sm text-indigo-600 font-medium">NEW</div>
                        <Avatar className="h-12 w-12 rounded-xl">
                            <AvatarImage className="h-full w-full object-cover" src={storage.getFilePreview("avatars", contact_offer.sender.avatar)} />
                            <AvatarFallback>
                                <img src="/blank_profile.png" alt="avatar" className="h-full w-full object-cover" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="max-xl:text-sm" ><span className="font-semibold">{contact_offer.sender.name}</span> jätti yhteydenoton <span className="font-semibold">"{contact_offer.offers.title}"</span></h3>
                            <p className="text-sm max-xl:text-xs text-gray-500">{formatDateTime(contact_offer.$createdAt, locale)}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                            <Button className="h-8 w-9" variant="ghost" title="Delete" onClick={() => onOpen("confirm-modal", { title: "Oletko varma?", description: "Haluatko varmasti poistaa yhteydenoton?", callback: () => handleDeleteOfferContact(contact_offer.$id) })}>
                                <Trash2 />
                            </Button>
                            {contentOpen !== 2 && contact_offer.status !== "readed" && (
                                <Button className="h-8 w-9" variant="ghost" title="Mark as readed" onClick={() => handleMarkAsReaded(contact_offer)}>
                                    <Eye />
                                </Button>
                            )}
                            <Button className="h-8 w-9" variant="ghost" title="Mark as favorite" onClick={() => handleAddToFavorites(contact_offer)}>
                                <Star className={contact_offer.is_favorite ? "text-yellow-500" : ""} />
                            </Button>
                            <Button className="h-8 w-9" variant="ghost" onClick={() => onOpen("contact-details-modal", { contact_offer })}>
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                ))} */}


            </div>

        </div>
    )
}