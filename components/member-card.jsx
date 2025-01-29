"use client"

import { Fragment, useEffect, useState } from 'react';

import { Calendar, Clock, ContactRound, EllipsisVertical, Info, Link, Mail, MapPin, Phone, Search } from 'lucide-react';
// import { companiesList } from '../utils/companies_data';
// import { hashEncodeId } from '../../hashId';

// import { useModal } from "../context/ModalProvider";
import { useRouter } from "next/navigation";

import {
   Avatar,
   AvatarFallback,
   AvatarImage
} from "@/components/ui/avatar"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { businessNetworksType } from '@/types/business-networks-type';

const companiesList = [
   {
      name: "BNI",
      image: "data:image/webp;base64,UklGRlYDAABXRUJQVlA4IEoDAAAwEgCdASo4ADgAPjEKjEYiEREMACADBLMAPQL6N+MHPARAyQPmh/DflH/Se0B4lv9u6gHmA/YD0a+oA/TvrT/Qz8sL2QP2G/ZD2kblL4J+DPwhHFop/vuZa/JfLPvnOiUZBJoG+k/Rg6xy/Rxnd8TGLQPDzQKma07g1SdvVH1qQ3eLLVbqrVRS8W6MkdYBU3PsHGuL+QWz/d6AAP7/fIJ/5lO7bR+gJ6L4jBPQIdaxTD6PIHyBtPcfb57oazGqRaB3xupmJPefsHP1URur7bjq3iAyhW/o1VEGuL/8CmMcGRLW4ymPHeL/zl9izNMqrcDS2E49Acn//8Fz06mBiDvsBb9//nozqzaJZ8q1Gf4VX3/2cX93UOE8GfEoIPaucLeK82vR3POg+vaL+Pgzzzu2yMIs6p2LS6R8EDbEK05r3h/Kj0Rqwj1SHdCl3SrknJEHLwHITrvCAOjqAFyEc5oyorq9qe3NYMdyQZY5OwH1u/1P/iguZlaJQBTkTuyyo//8//88WP5mLCDAl0civL0vh74wvjXE6FgtJ9bQrWWVI9DDj9Zhn86H25y8bNH50WbQ3jra/P98C8+xX+t8w6K+KdW2Zp7iZnmBnaeAoo7S7Lfrc0Rtpj22uPjamqniGf5rDGLHZUiqL/55Invq6fvViWfhr/hQ2yu4gtFljjfkxHiqjn/HA4tSjv4146drIJNXl/I//5a6I387CHBR7F+9TsG2E/87am+R5+4bBN1WWHHeGbZfRWhIMtWJjtGaD+Kg2Ycw4rB9iuWxf/rxCOsKq0wGSAT8j87mBayZps45tSyEytH6sAv4U0i+aZcS54A+As9UYmyHEH6VA/1U8M8lWExibRZCpMSmr/aKYpwQjQ7fSm/j35vg7OPA4lwcAGizbIfsZJafR30hzfIcG54lt1vWWMccE7V9ZH5/q+HneEld9AI++AVpZjXypwERu+jlaVL6NO9u0/69cmm2AYGSx/6URrG86RryH/whmpGP9biYPPV2/8NKhiessbxkzzlVfyCA1ex/sAq09FzE7SsekdXAsooPJrG4Kz9ICf6XM71HGJurp635mBLfku+DAvz6Ynow9PB7Kk2YsuCxYu996EA8Ij3YAAAAAA=="
   },
   {
      name: "Business Festival",
      image: "data:image/webp;base64,UklGRtoDAABXRUJQVlA4IM4DAAAwFACdASo4ADgAPjEOjEYiEREKACADBLIAYIsAvzP8QO2A0HzD8O+dM5Y6HcQZngfarvgPMB+rn6V9g70AP0a62b0Gv2d9Mz2Of25/Yj2iqXR9L/HD9yMw/+K8mtwrNlfFQTF/7H6Deg5UL/LNBEBmRNdvcjW9J3yQIlFHnP8cTxGLm4Gvu2k+UgCgXIUHaygMgyn/2ylrip7DhtRlhE8D+6TZNZgOH6YAAAD+//4Y4B63onctKp4jGBdMHwg6r/NiWNvZ/6UUqLjEr3OksIJOCAUpnzVs8YGewnCh/XPIy/qLkl3SV8fXQ3ww6Rm/Fc+N6QHQsVg3ev+uY/xD+O3/q5S8hOHtwDfcYRjFKQ1cPAo/sP7dogiwe4lFKN54n//Dz/l2fTX8jhUbR1mYKOR5rF04IX0oBWzq3uzhwftTPa+f1VgNpQ7QPHESASIHZbfNUHfyMOOuofwY98ecpY6/PdtgP8Z5PFOeqNPh/je+WHBJ++wWZYaIy+ta1khoFTW3ACc2RDldlNYmwt4BeqkPGQlrA8MTfo9C3Mu+ru6NqX//xYfgsZZJOkMV6oND8f3v0yNYYytq+j/0rEOjZf/HTvnD8zNA3HpBkQb0Dv5fmsuhNfMSecQou6XbKg3//KH/vwacEROlF8fPYp4A624Fd0S6cA6H5wavQA3Lg2GqPsdx2TwfgZyTDu69I78hXcI4oZ9tZufl2s/s9oElwwL4oGaSed9W9b+CMlYw7d4NR+40UtGo4C6fxGXYcZVFpLHJ2L/rb9Xe8u9w4byQYOrb4HwMLraLVsOHcRG4vdV4nu6AzlDliyAszF1nZGDFmjxkNyzvAva262QXiJKG16hp1CqqzSJwO8jT7te/kLU4phzSe3J8Ce1FqJj6d2VIQXMiTWfF2z32ad8Syl4uGnzs4LZ2CHOHa03Inf3/fcv6eUkp8xrzmNE4vg+V9dxJv4uP4GnDiYqQciio3OT/ljOvwa9Yl6K7PV7jVg8bj32nPYsbBwHgOFWhHvcLlm5W1QLmEpluaL/CpW+aohaZ3/vNTcLLJnvz+GwqCdrNYOd2qjzA0nnTU6dnV3cN93D8WJ1KN6byQckbi7ZydF6UdtsNvTns8JucjOHIQVmeNWl8IKWm5UKwv8PwyU99S49feae1/buAkeQL/7q1f6NX+4X7eOrxuLKS8Z2Hay6dWM8BzmrkyXEpqIx3nQh8Kep17FRMbPt0tANHeLJsXxF99aHRbSq1f24iG7zi2OB8bRLE273dQcucyw1evmLEwCpjZMIhycSXU6xCD+kqj/oAAA=="
   },
   {
      name: "Boost",
      image: "data:image/webp;base64,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"
   },
   {
      name: "Suositus.fi",
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAS1BMVEVHcEx5u+NLm9I/kcxAkcw6jss4jco3jcpGlM0+kMtep9hbnNBHlM48j8tNoNVTuupUruBHtedDtOdMt+hHtedCk81Lt+g/kcxQmc/rTGjuAAAAGHRSTlMAD0OMo/b//2XRHi58509bN97/g9KFqrmy1uvdAAAAl0lEQVR4AcXNRxLEMAgAQZRQcs7/f+mqWOMsXz03VQuAcwLyCfmCUr2gNnkTaF0WPSKGnNmEJj5RgRYplSHKGpej27QoL2Z9YAsVyAMnilA3KzrrG6iY6dF2PV+09JnYlhJk23VHRGJnEjVDoh1H/JeY6YhcrAke0T6g+gCdfUEo7R0FcPqK02pUmBkvxMw4BbgX9ZLwSD+5ORFzIOXX/wAAAABJRU5ErkJggg=="
   },
   {
      name: "Suomen yrittäjät",
      image: "data:image/webp;base64,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"
   },
   {
      name: "Keuke",
      image: "https://www.keuke.fi/client/keuke/images/logo-black.png"
   },
];

import MemberCardWeekSearch from './week-search/member-card-week-search';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { useModal } from '@/hooks/use-modal';
import { createDocument } from '@/lib/appwrite/server/appwrite';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/appwrite/client/appwrite';

const MemberCard = ({ member, currentUser }) => {
   const [dropdownOpen, setDropdownOpen] = useState(false);

   const [contentOpen, setContentOpen] = useState(1)
   const isAdmin = member.role === "admin";
   const router = useRouter();
   const t = useTranslations()

   const { toast } = useToast()
   const { onOpen } = useModal();
   const businessNetworks = member.profiles.business_networks
      ? businessNetworksType.filter(el => member.profiles.business_networks.find(bns => bns === el.name))
      : [];

   const requestReviewHandler = async () => {
      try {
         await createDocument("main_db", "notifications", {
            body: {
               profiles: member.$id,
               type: "review",
               sender_id: currentUser.$id,
               entity_id: currentUser.google_review_link,
            }
         });

         toast({
            variant: "success",
            title: "Arvostelu",
            description: "Arvostelu pyyntö on lähetetty onnistuneesti."
         })
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <div className="group min-w-[380px] max-xs:min-w-[325px] group bg-white rounded-xl p-5 max-xs:p-3 border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all space-y-3">
         {/* Header section with avatar and basic info */}
         <div className='flex items-start gap-5'>
            <Avatar className="h-20 w-20 rounded-xl ring-2 ring-gray-100">
               <AvatarImage src={storage.getFilePreview("avatars", member.profiles.avatar)} alt={member.profiles.name} className="object-cover" />
               <AvatarFallback className="bg-indigo-50">
                  <img src={'/blank_profile.png'} alt="avatar" className="h-full w-full object-cover" />
               </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
               <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                     <h2 className="text-lg font-semibold text-gray-900 truncate">{member.profiles.name}</h2>
                     {isAdmin && (
                        <span className='inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-100'>
                           {t("admin")}
                        </span>
                     )}
                  </div>

                  <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
                     <DropdownMenuTrigger className="focus:outline-none">
                        <div className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                           <EllipsisVertical className="h-5 w-5 text-gray-500" />
                        </div>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/public-profile/${member.profiles.$id}`)}>
                           {t("view_profile")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("invite-modal", { recipient: member, type: "networks" }) // TODO: CHECK IF I PASS JUST MEMBER
                           setDropdownOpen(false)
                        }}>
                           {t("invite_network")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("invite-modal", { recipient: member, type: "groups" })
                           setDropdownOpen(false);
                        }}>
                           {t("invite_group")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("create-meeting", { recipient: member })
                           // setDropdownOpen(false);
                        }}>
                           {t("create_meet")}
                        </DropdownMenuItem>
                        {currentUser.google_review_link &&
                           <DropdownMenuItem className="cursor-pointer" onClick={() => {
                              onOpen("confirm-modal", {
                                 type: "mail",
                                 title: t("send_review_request"),
                                 description: t("confirm_send_review"),
                                 callback: () => requestReviewHandler()
                              })
                              setDropdownOpen(false)
                           }}>
                              {t("send_review_request")}
                           </DropdownMenuItem>
                        }
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
               {member.profiles.job_title && (
                  <p className='text-sm font-medium text-indigo-600 mb-0.5'>{member.profiles.job_title}</p>
               )}
            </div>
         </div>
         <div className='flex items-center gap-1'>
            {
               businessNetworks.length !== 0 &&
               businessNetworks.map((el, i) => <img key={i} className='w-[25px] h-[25px]' src={el.image} alt="network_logo" title={el.name} />)
            }
         </div>
         {/* <div>
            {member.profiles.companies && (
               <SVGComponent
                  url="https://appwrite.superman.fi/v1/storage/buckets/logos/files/677ea4fb00213c72e5da/view?project=networking-prod"
                  className="w-20 inline-block"
                  alt="Company Logo"
               />
            )}
         </div> */}
         {/* Tab navigation */}
         <div className="flex border-b border-gray-200">
            <button
               onClick={() => setContentOpen(1)}
               className={`px-3 py-2 -mb-px text-sm font-medium ${contentOpen === 1
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("contact")}
            </button>
            <button
               onClick={() => setContentOpen(2)}
               className={`px-3 py-2 -mb-px text-sm font-medium ${contentOpen === 2
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("info")}
            </button>
            <button
               onClick={() => setContentOpen(3)}
               className={`px-3 py-2 -mb-px text-sm font-medium ${contentOpen === 3
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("search")}
            </button>
            <button
               onClick={() => setContentOpen(4)}
               className={`px-3 py-2 -mb-px text-sm font-medium ${contentOpen === 4
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("meets")}
            </button>
         </div>

         {/* Tab content */}
         <div className="min-h-[180px]">
            {contentOpen === 1 && (
               <div className="grid gap-3">
                  {member.profiles.searching && (
                     <div className="rounded-lg p-3 border border-indigo-100 hover:border-indigo-200">
                        <div className="flex items-start gap-3">
                           <div className="bg-white rounded-lg">
                              <Search className="h-5 w-5 text-indigo-600" />
                           </div>
                           <div>
                              <h3 className="text-sm font-medium text-indigo-900 mb-1">{t("currently_searching_for")}</h3>
                              <p className="text-sm text-indigo-700">
                                 {member.profiles.searching}
                              </p>
                           </div>
                        </div>
                     </div>
                  )}

                  {member.profiles.phone && member.profiles.show_phone && (
                     <a
                        href={`tel:${member.profiles.phone}`}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 group-hover:bg-gray-50/50 transition-colors"
                     >
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <Phone className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{member.profiles.phone}</span>
                     </a>
                  )}

                  {member.profiles.email && member.profiles.show_email && (
                     <a
                        href={`mailto:${member.profiles.email}`}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 group-hover:bg-gray-50/50 transition-colors"
                     >
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <Mail className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{member.profiles.email}</span>
                     </a>
                  )}
                  {member.profiles.location && (
                     <div className="flex items-center gap-3 p-1 rounded-lg group-hover:bg-gray-50/50 transition-colors">
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <MapPin className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600">{member.profiles.location}</span>
                     </div>
                  )}
               </div>
            )}

            {contentOpen === 2 && (
               <div className="space-y-6 py-2">
                  {member.profiles.introduction && (
                     <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           {t("introduction")}
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.profiles.introduction}
                        </p>
                     </div>
                  )}
                  {member.profiles.offering && (
                     <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           {t("we_offer")}
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.profiles.offering}
                        </p>
                     </div>
                  )}
                  {member.profiles.searching && (
                     <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           {t("looking_for")}
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.profiles.searching}
                        </p>
                     </div>
                  )}
               </div>
            )}

            {contentOpen === 3 && (
               <MemberCardWeekSearch member={member.profiles} />
            )}

            {contentOpen === 4 && (
               <div className="space-y-4">
                  {member.profiles.meets.length !== 0
                     ? member.profiles.meets.map((meet) => (
                        <div
                           key={meet.$id}
                           className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                        >
                           <div className="flex items-start gap-4">
                              <div className="shrink-0">
                                 <div className="bg-indigo-50 rounded-lg p-2">
                                    <Calendar className="h-4 w-4 text-indigo-600" />
                                 </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                 <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <h2 className="text-sm font-semibold text-gray-900 flex-1">
                                       {meet.title}
                                    </h2>
                                    <span className="text-xs self-start font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                       {format(new Date(meet.date), 'dd.MM.yyyy')}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 mb-1.5 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                       <MapPin className="h-4 w-4" />
                                       <span className='text-black'>{meet.location}</span>
                                    </div>
                                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                                    <div className="flex items-center gap-1">
                                       <Clock className="h-4 w-4" />
                                       <span className='text-black'>{meet.start_time} - {meet.end_time}</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-gray-600 leading-thin">
                                    {meet.description}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))
                     : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                           <div className="bg-white rounded-full p-3 mb-4 border border-gray-200 shadow-sm">
                              <Search className="h-5 w-5 text-indigo-500" />
                           </div>
                           <h3 className="text-sm font-medium text-gray-900 mb-1">{t("no_meetings")}</h3>
                        </div>
                     )
                  }
               </div>
            )}
         </div>
      </div>
   );
};

export default MemberCard;
