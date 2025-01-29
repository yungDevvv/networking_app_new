"use client"

import { Send, UserPlus, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { mauticEmailService } from "@/lib/mautic/mautic";
import { useOrigin } from "@/hooks/use-origin";
import { useUpdateUser, useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { createDocument, getDocument, listDocuments } from "@/lib/appwrite/server/appwrite";

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [recieverEmail, setRecieverEmail] = useState("");
    const [message, setMessage] = useState("");

    const { toast } = useToast();
    const user = useUser();
    const updateUser = useUpdateUser();

    const [isLoading, setIsLoading] = useState(false);

    // Käsitellään kutsutut käyttäjät user.invited_users-taulukosta
    const invitations = user.invited_users ? user.invited_users.map(invite => ({
        email: invite.invited_email,
        status: invite.status || "waiting",
        sentAt: new Date(invite.$createdAt).toLocaleDateString('fi-FI')
    })) : [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = invitations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(invitations.length / itemsPerPage);

    const origin = useOrigin();

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInvite = async () => {
        setIsLoading(true);
        setMessage("");
        
        try {
            const inviteAlreadyExists = await listDocuments("main_db", "invited_users", [{type: "equal", name: "invited_email", value: recieverEmail}]);
            
            if (inviteAlreadyExists.total > 0) {
                setMessage("Tällä sähköpostilla käyttäjä on jo kutsuttu! Ole hyvä ja valitse toinen käyttäjä kutsuttavaksi!");
                setIsLoading(false);
                return;
            }
            
            await mauticEmailService.sendEmail({
                reciever_email: recieverEmail,
                invite_link: origin + `/register?ref=${user.referal_code}`,
                inviter_name: user.name
            })

            await createDocument("main_db", "invited_users", {
                body: {
                    invited_email: recieverEmail,
                    profiles: user.$id
                }
            })
           
            await updateUser();

            toast({
                variant: "success",
                title: "Kutsu",
                description: "Kutsu on onnistuneesti l‰hetetty",
            })

        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-5xl pl-10 max-lg:pl-5 mx-auto h-full pb-10 max-sm:pl-0">
            <div className="space-y-10">
                {/* Kutsu uusia käyttäjiä */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-xl font-semibold">Kutsu uusia käyttäjiä</h1>
                        <p className="text-muted-foreground">Lähetä kutsuja sähköpostitse uusille käyttäjille liittyäkseen verkostoosi</p>
                    </div>
                    {message && <p className="text-red-600">{message}</p>}
                    <div className="flex gap-4 items-end max-sm:flex-col">
                        <div className="flex-1">
                            <Input
                                type="email"
                                placeholder="anna.example@email.com"
                                className="w-full"
                                onChange={(e) => setRecieverEmail(e.target.value)}
                            />
                        </div>
                        <Button className="flex items-center gap-2" onClick={handleInvite} disabled={isLoading}>
                            Lähetä kutsu
                        </Button>
                    </div>
                </div>
                <Separator className="my-5" />
                {/* Kutsulista */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Lähetetyt kutsut</h2>
                        <p className="text-muted-foreground">Seuraa lähetettyjen kutsujen tilaa</p>
                    </div>
                    <div className="space-y-2">
                        {currentItems.map((invite, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{invite.email}</p>
                                        <p className="text-sm text-muted-foreground">Lähetetty: {invite.sentAt}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {invite.status === "waiting" && (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Odottaa</span>
                                        </div>
                                    )}
                                    {invite.status === "registered" && (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Rekisteröitynyt</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Edellinen
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Seuraava
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}